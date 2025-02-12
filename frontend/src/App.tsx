import CustomerServiceSystem from '@/components/customer-service-system';
import Dashboard from './components/dashboard';
import { Suspense } from 'react';
import axios from 'axios';
import { DashboardSkeleton } from './components/dashboard-skeleton';

async function getDashboardStatsValue() {
  try {
    const response = await axios.get('http://localhost:3000/');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalTickets: 0,
      resolvedTickets: 0,
      openTickets: 0,
      activeAgent: 0,
    };
  }
}

async function getActionHistory() {
  try {
    const response = await axios.get('http://localhost:3000/api/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
  }
}

export default function Home() {
  const statsValuePromise = getDashboardStatsValue();
  const actionHistoryPromise = getActionHistory();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Customer Service System</h1>
      <CustomerServiceSystem historyPromise={actionHistoryPromise}>
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard dashboardPromise={statsValuePromise} />
        </Suspense>
      </CustomerServiceSystem>
    </main>
  );
}
