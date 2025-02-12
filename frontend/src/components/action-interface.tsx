'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Action = {
  id: number;
  ticketId: number;
  agentId: number;
  action: string;
  timestamp: string;
};

const mockActions: Action[] = [
  { id: 1, ticketId: 1, agentId: 1, action: 'Assigned', timestamp: '2023-05-01 10:00:00' },
  { id: 2, ticketId: 1, agentId: 1, action: 'Updated', timestamp: '2023-05-01 10:15:00' },
  { id: 3, ticketId: 2, agentId: 2, action: 'Assigned', timestamp: '2023-05-01 11:00:00' },
];

export default function ActionInterface() {
  const [actions, setActions] = useState<Action[]>(mockActions);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Action History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action ID</TableHead>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Agent ID</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.map((action) => (
            <TableRow key={action.id}>
              <TableCell>{action.id}</TableCell>
              <TableCell>{action.ticketId}</TableCell>
              <TableCell>{action.agentId}</TableCell>
              <TableCell>{action.action}</TableCell>
              <TableCell>{action.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
