import { SidebarNav } from './sidebar-nav';
import { BottomNav } from './bottom-nav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar text-sidebar-foreground">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Kirari</h1>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
