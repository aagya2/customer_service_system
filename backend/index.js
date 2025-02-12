import express from 'express';
import cors from 'cors';

class Ticket {
  constructor(id, customerName, description, priority, category) {
    this.id = id;
    this.customerName = customerName;
    this.description = description;
    this.priority = priority;
    this.category = category;
    this.status = 'NEW';
    this.createdAt = new Date();
    this.responses = [];
    this.assignedAgent = 'Moee';
  }
}

class Dashboard {
  constructor() {
    this.totalTickets = 0;
    this.resolveTicket = 0;
    this.openTicket = 0;
    this.activeAgent = 0;
  }
  addTicket() {
    this.totalTickets++;
    this.openTicket++;
    this.activeAgent = 1;
  }
  addResolveTicket() {
    this.openTicket--;
    this.resolveTicket++;
  }
  getTotalTicket() {
    return this.totalTickets;
  }
  getOpenTicket() {
    return this.openTicket;
  }
  getTotalResolveTicket() {
    return this.resolveTicket;
  }
  getActiveAgent() {
    return this.activeAgent;
  }
}

class CustomerServiceSystem {
  constructor() {
    // Priority Queue for urgent tickets (implemented as array with sorting)
    this.urgentQueue = [];
    // Regular Queue for normal tickets
    this.normalQueue = [];
    // Stack for action history
    this.actionHistory = [];
    // Counter for ticket IDs
    this.ticketCounter = 0;
    //agentBust
    this.agentBusy = false;
  }

  createTicket(customerName, description, priority, category) {
    this.ticketCounter = Math.floor(Math.random() * 1000) + 1;
    const ticket = new Ticket(this.ticketCounter, customerName, description, priority, category);

    if (priority === 'CRITICAL' || priority === 'HIGH' || priority === 'LOW') {
      this.urgentQueue.push(ticket);
      // Sort by priority and creation time
      this.urgentQueue.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.createdAt - b.createdAt;
        }
        return this.getPriorityValue(a.priority) - this.getPriorityValue(b.priority);
      });
    } else {
      this.normalQueue.push(ticket);
    }

    this.recordAction(
      `Ticket #${ticket.id} created by ${customerName}`,
      ticket.id,
      ticket.priority
    );
    return ticket;
  }

  getPriorityValue(priority) {
    const priorities = {
      CRITICAL: 1,
      HIGH: 2,
      MEDIUM: 3,
      LOW: 4,
    };
    return priorities[priority];
  }

  assignTicket(agentName = 'Moee') {
    if (this.agentBusy) {
      throw new Error('Agent already has an active ticket');
    }

    let ticket = null;
    if (this.urgentQueue.length > 0) {
      ticket = this.urgentQueue.shift();
    } else if (this.normalQueue.length > 0) {
      ticket = this.normalQueue.shift();
    }

    if (ticket) {
      ticket.status = 'IN_PROGRESS';
      ticket.assignedAgent = agentName;
      this.agentBusy = true;
      this.recordAction(
        `Ticket #${ticket.id} assigned to ${agentName}`,
        ticket.id,
        ticket.priority
      );
    }

    return ticket;
  }

  resolveTicket(ticketId) {
    this.agentBusy = false; // Agent is now available for the next ticket
    this.recordAction(`Ticket #${ticketId} resolved`, ticketId);
  }

  recordAction(action, ticketId, priority = '') {
    this.actionHistory.unshift({
      id: Math.floor(Math.random() * 100) + 1,
      timestamp: new Date(),
      action: action,
      ticketId,
      priority,
    });
  }
}

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize the customer service system
const serviceSystem = new CustomerServiceSystem();
const dashboard = new Dashboard();
console.log(serviceSystem);
console.log(dashboard);

// API Routes
app.get('/', (req, res) => {
  console.log('Accessing dashboard route');
  try {
    const dashboardData = {
      totalTickets: dashboard.getTotalTicket(),
      openTicket: dashboard.getOpenTicket(),
      activeAgent: dashboard.getActiveAgent(),
      resolvedTicket: dashboard.getTotalResolveTicket(),
    };
    console.log('Dashboard data:', dashboardData);
    res.json(dashboardData);
  } catch (error) {
    console.error('Error in dashboard route:', error);
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/tickets', (req, res) => {
  const { customerName, description, category } = req.body;
  const randNum = Math.floor(Math.random() * 4) + 1;
  let priority;
  switch (randNum) {
    case 1:
      priority = 'CRITICAL';
      break;
    case 2:
      priority = 'HIGH';
      break;
    case 3:
      priority = 'LOW';
      break;
    case 4:
      priority = 'NORMAL';
      break;
    default:
      break;
  }
  // serviceSystem.assignTicket();
  const ticket = serviceSystem.createTicket(customerName, description, priority, category);
  dashboard.addTicket();
  console.log(serviceSystem);
  console.log(dashboard);
  res.json(ticket);
});

app.get('/api/tickets/urgent', (req, res) => {
  res.json(serviceSystem.urgentQueue);
});

app.get('/api/tickets/normal', (req, res) => {
  res.json(serviceSystem.normalQueue);
});

app.get('/api/history', (req, res) => {
  res.json(serviceSystem.actionHistory);
});

app.patch('/api/tickets/:ticketId', (req, res) => {
  const { ticketId } = req.params;
  const { status, assignedTo } = req.body;

  let ticket =
    serviceSystem.urgentQueue.find((t) => t.id == ticketId) ||
    serviceSystem.normalQueue.find((t) => t.id == ticketId);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // Update ticket details
  if (status) ticket.status = status;
  if (assignedTo) ticket.assignedAgent = assignedTo;

  res.json({ success: true, message: `Ticket #${ticket.id} updated`, ticket });
});

app.patch('/api/tickets/:ticketId/resolve', (req, res) => {
  const { ticketId } = req.params;

  let ticket =
    serviceSystem.urgentQueue.find((t) => t.id == ticketId) ||
    serviceSystem.normalQueue.find((t) => t.id == ticketId);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  // Update ticket status
  ticket.status = 'RESOLVED';
  ticket.assignedAgent = null;

  // Remove from queue (as it's resolved)
  serviceSystem.urgentQueue = serviceSystem.urgentQueue.filter((t) => t.id != ticketId);
  serviceSystem.normalQueue = serviceSystem.normalQueue.filter((t) => t.id != ticketId);

  // Record action in history
  serviceSystem.recordAction(`Ticket #${ticket.id} marked as resolved`, ticket.id, ticket.priority);

  // Increment resolved count in dashboard
  dashboard.addResolveTicket();
  console.log(serviceSystem);

  res.json({ success: true, message: `Ticket #${ticket.id} resolved`, ticket });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
