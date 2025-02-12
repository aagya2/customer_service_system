# Customer Service Ticket Management System

A modern customer service system that implements queue data structures to efficiently manage and process support tickets. The system uses a priority queue for urgent tickets, a regular queue for normal tickets, and a stack for action history.

## Features

- **Priority-based Ticket Management**
  - Urgent queue for critical and high-priority tickets
  - Normal queue for medium and low-priority tickets
  - Automatic ticket routing based on priority

- **Agent Management**
  - Agent availability tracking
  - Ticket assignment system
  - Agent performance metrics

- **Real-time Queue Visualization**
  - Separate views for urgent and normal queues
  - Current queue status
  - Action history tracking

## Tech Stack

### Backend
- Node.js
- Express.js
- In-memory data structures (Priority Queue, Queue, Stack)

### Frontend
- React
- TailwindCSS
- shadcn/ui components


## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/customer-service-system.git
cd customer-service-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```
The server will run on http://localhost:3000

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The application will open in your browser at http://localhost:5173

## API Endpoints

### Tickets
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/urgent` - Get urgent ticket queue
- `GET /api/tickets/normal` - Get normal ticket queue
- `POST /api/tickets/:ticketId/resolve` - Resolve a ticket


## Data Structures Used

1. **Priority Queue (Urgent Queue)**
   - Handles critical and high-priority tickets
   - Maintains sort order by priority and creation time
   - O(log n) insertion time

2. **Regular Queue (Normal Queue)**
   - Handles medium and low-priority tickets
   - First-in-first-out (FIFO) structure
   - O(1) insertion and removal

3. **Stack (Action History)**
   - Tracks system actions and changes
   - Last-in-first-out (LIFO) structure
   - Used for audit trail and action tracking

## Frontend Components

1. **TicketQueue Component**
   - Displays urgent and normal ticket queues
   - Real-time updates
   - Priority visualization

2. **AgentDashboard Component**
   - Shows agent status and current tickets
   - Performance metrics
   - Ticket assignment interface

3. **ActionHistory Component**
   - Displays recent system actions
   - Filtering capabilities
   - Timestamp tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Priority Queue implementation inspired by standard heap data structure
- UI design based on modern customer service systems
- React components utilizing shadcn/ui library

## Future Enhancements

- [ ] Add database integration
- [ ] Implement real-time notifications
- [ ] Add ticket categories and routing rules
- [ ] Enhance agent assignment algorithm
- [ ] Add reporting and analytics
- [ ] Implement chat functionality

## Contact

Your Name - Aagya Adhikari 

Project Link: [https://github.com/aagya2/customer-service-system](https://github.com/yourusername/customer-service-system)
