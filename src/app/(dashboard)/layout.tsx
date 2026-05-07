import Sidebar from '@/components/navigation/sidebar';
import { UserProvider } from '@/hooks/use-user';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{
          flex: 1,
          marginLeft: 260,
          minHeight: '100vh',
          background: 'var(--color-surface-subtle)'
        }}>
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
