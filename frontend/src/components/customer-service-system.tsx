'use client';

import { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerInterface from '@/components/customer-interface';
import AgentInterface from '@/components/agent-interface';
import ActionHistory from '@/components/action-history';
import { AgentInterfaceSkeleton } from './agent-interface-skeleton';
import { CustomerInterfaceSkeleton } from '@/components/customer-interface-skeleton';
import { ActionHistorySkeleton } from '@/components/action-history-skeleton';

export default function CustomerServiceSystem({
  children,
  historyPromise,
}: {
  children: React.ReactNode;
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
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div className="space-y-8">
      {children}
      <div className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer" className="cursor-pointer">
              Customer
            </TabsTrigger>
            <TabsTrigger value="agent" className="cursor-pointer">
              Agent
            </TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <Suspense fallback={<CustomerInterfaceSkeleton />}>
              <CustomerInterface />
            </Suspense>
          </TabsContent>
          <TabsContent value="agent">
            <Suspense fallback={<AgentInterfaceSkeleton />}>
              <AgentInterface />
            </Suspense>
          </TabsContent>
        </Tabs>
        <Suspense fallback={<ActionHistorySkeleton />}>
          <ActionHistory historyPromise={historyPromise} />
        </Suspense>
      </div>
    </div>
  );
}
