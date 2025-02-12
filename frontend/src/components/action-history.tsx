'use client';

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ActionHistory({
  historyPromise,
}: {
  historyPromise: Promise<
    {
      timestamp: Date;
      action: string;
      ticketId: string;
      id: string;
      priority: string;
    }[]
  >;
}) {
  const actions = use(historyPromise);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {actions.map((action) => (
                <motion.tr
                  key={action.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell>{action.ticketId}</TableCell>
                  <TableCell>{action.action}</TableCell>
                  <TableCell>{new Date(action.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        action.priority.toLowerCase() === 'critical'
                          ? 'bg-red-500 text-white'
                          : action.priority.toLowerCase() === 'high'
                          ? 'bg-yellow-500 text-black'
                          : action.priority.toLowerCase() === 'medium'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-500 text-white'
                      }
                    >
                      {action.priority}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
