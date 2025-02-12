'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

type Ticket = {
  id: number;
  title: string;
  status: 'open' | 'assigned' | 'resolved';
  category: string;
  assignedTo: number | null;
  priority: 'high' | 'medium' | 'low' | 'normal';
};

type Agent = {
  id: number;
  name: string;
  status: 'available' | 'busy';
};

export default function AgentInterface() {
  const [urgentTickets, setUrgentTickets] = useState<Ticket[]>([]);
  const [normalTickets, setNormalTickets] = useState<Ticket[]>([]);
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: 'Alice', status: 'available' },
    { id: 2, name: 'Bob', status: 'available' },
  ]);
  const [currentAgent, setCurrentAgent] = useState<Agent>(agents[0]);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [nextTicketId, setNextTicketId] = useState<number | null>(null);

  // Fetch tickets periodically
  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      // Fetch urgent tickets (already sorted by priority)
      const urgentResponse = await axios.get('http://localhost:3000/api/tickets/urgent');
      setUrgentTickets(urgentResponse.data);

      // Fetch normal tickets (FIFO order)
      const normalResponse = await axios.get('http://localhost:3000/api/tickets/normal');
      setNormalTickets(normalResponse.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tickets',
        variant: 'destructive',
      });
    }
  };

  const getNextTicket = () => {
    // Process urgent queue first
    if (urgentTickets.length > 0) {
      return urgentTickets[0]; // Already sorted by priority from the API
    }
    // If urgent queue is empty, process normal queue
    if (normalTickets.length > 0) {
      return normalTickets[0]; // FIFO order from the API
    }
    return null;
  };

  const updateAgentStatus = (agentId: number, status: 'available' | 'busy') => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => (agent.id === agentId ? { ...agent, status } : agent))
    );
    setCurrentAgent((prev) => (prev.id === agentId ? { ...prev, status } : prev));
  };

  const handleAssignTicket = () => {
    if (currentAgent.status === 'available') {
      const nextTicket = getNextTicket();
      if (nextTicket) {
        setNextTicketId(nextTicket.id);
        updateAgentStatus(currentAgent.id, 'busy');
        toast({
          title: 'Next Ticket',
          description: `Ticket #${nextTicket.id} (${nextTicket.priority} priority) is ready for processing.`,
        });
      } else {
        toast({
          title: 'No Tickets',
          description: 'There are no tickets available for processing.',
        });
      }
    }
  };

  const handleProcessTicket = async () => {
    if (nextTicketId && currentAgent.status === 'busy') {
      const nextTicket = getNextTicket();
      if (nextTicket && nextTicket.id === nextTicketId) {
        try {
          await axios.patch(`http://localhost:3000/api/tickets/${nextTicket.id}`, {
            status: 'assigned',
            assignedTo: currentAgent.id,
          });

          if (nextTicket.priority !== 'normal') {
            setUrgentTickets((prev) => prev.filter((t) => t.id !== nextTicket.id));
          } else {
            setNormalTickets((prev) => prev.filter((t) => t.id !== nextTicket.id));
          }

          setCurrentTicket(nextTicket);
          setNextTicketId(null);

          toast({
            title: 'Ticket Assigned',
            description: `Processing ${nextTicket.priority} priority Ticket #${nextTicket.id}`,
          });
        } catch (error) {
          console.error('Error processing ticket:', error);
          updateAgentStatus(currentAgent.id, 'available');
          toast({
            title: 'Error',
            description: 'Failed to process ticket',
            variant: 'destructive',
          });
        }
      }
    }
  };

  const handleResolveTicket = async () => {
    if (currentTicket) {
      try {
        // Update ticket status in backend
        await axios.patch(`http://localhost:3000/api/tickets/${currentTicket.id}/resolve`, {
          status: 'resolved',
          assignedTo: null,
        });

        // Add to resolved tickets
        setResolvedTickets((prev) => [
          {
            ...currentTicket,
            status: 'resolved',
          },
          ...prev,
        ]);

        // Remove from urgent or normal queue if present
        setUrgentTickets((prev) => prev.filter((t) => t.id !== currentTicket.id));
        setNormalTickets((prev) => prev.filter((t) => t.id !== currentTicket.id));

        // Reset agent status and current ticket
        updateAgentStatus(currentAgent.id, 'available');
        setCurrentTicket(null);

        toast({
          title: 'Ticket Resolved',
          description: `Ticket #${currentTicket.id} has been resolved.`,
        });

        // Refresh all tickets to ensure sync with backend
        await fetchAllTickets();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Error resolving ticket:', error);
        toast({
          title: 'Error',
          description: 'Failed to resolve ticket',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Current Agent: {currentAgent.name}</span>
            <Badge variant={currentAgent.status === 'available' ? 'outline' : 'secondary'}>
              {currentAgent.status}
            </Badge>
            <Button
              onClick={handleAssignTicket}
              disabled={currentAgent.status === 'busy'}
              className="cursor-pointer"
            >
              Request Next Ticket
            </Button>
            <Button
              onClick={handleProcessTicket}
              disabled={!nextTicketId || currentAgent.status === 'available'}
              className="cursor-pointer"
            >
              Process Ticket
            </Button>
            <Button
              onClick={handleResolveTicket}
              disabled={!currentTicket || currentAgent.status === 'available'}
              className="cursor-pointer"
            >
              Resolve Current Ticket
            </Button>
          </div>

          {nextTicketId && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <p>Next Ticket ID: {nextTicketId}</p>
            </motion.div>
          )}

          {currentTicket && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <p>
                Current Ticket: #{currentTicket.id} - {currentTicket.title} (
                {currentTicket.priority} priority)
              </p>
            </motion.div>
          )}

          <Tabs defaultValue="urgent">
            <TabsList>
              <TabsTrigger value="urgent" className="cursor-pointer">
                Urgent Queue ({urgentTickets.length})
              </TabsTrigger>
              <TabsTrigger value="normal" className="cursor-pointer">
                Normal Queue ({normalTickets.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="cursor-pointer">
                Resolved ({resolvedTickets.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="urgent">
              <TicketTable tickets={urgentTickets} showPriority />
            </TabsContent>
            <TabsContent value="normal">
              <TicketTable tickets={normalTickets} showPriority />
            </TabsContent>
            <TabsContent value="resolved">
              <TicketTable tickets={resolvedTickets} showPriority />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

function TicketTable({ tickets, showPriority }: { tickets: Ticket[]; showPriority: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Category</TableHead>
          {showPriority && <TableHead>Priority</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence mode="popLayout">
          {tickets.map((ticket) => (
            <motion.tr
              key={`${ticket.id}-${ticket.status}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.status}</TableCell>
              <TableCell>{ticket.category}</TableCell>
              {showPriority && (
                <TableCell>
                  <Badge
                    className={
                      ticket.priority.toLowerCase() === 'critical'
                        ? 'bg-red-500 text-white'
                        : ticket.priority.toLowerCase() === 'high'
                        ? 'bg-yellow-500 text-black'
                        : ticket.priority.toLowerCase() === 'medium'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-500 text-white'
                    }
                  >
                    {ticket.priority}
                  </Badge>
                </TableCell>
              )}
            </motion.tr>
          ))}
        </AnimatePresence>
      </TableBody>
    </Table>
  );
}
