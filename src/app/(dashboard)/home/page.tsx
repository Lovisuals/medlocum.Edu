import type { Metadata } from 'next';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard — MedLocum Academy',
  description: 'Your MedLocum Academy dashboard. View compliance status, due courses, CPD progress and placement readiness.'
};

export default async function HomePage() {
  return <DashboardContent />;
}
