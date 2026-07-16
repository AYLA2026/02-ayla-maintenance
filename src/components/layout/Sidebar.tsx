'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  School,
  MessageSquare,
  CalendarDays,
  Users,
  Package,
  Truck,
  FileText,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Wrench,
  Wind,
  Camera,
  FolderKanban,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { title: 'الرئيسية', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
  { title: 'المشاريع', href: '/projects', icon: <FolderKanban className="w-5 h-5" /> },
  { title: 'المدارس', href: '/schools', icon: <School className="w-5 h-5" /> },
  { title: 'البلاغات', href: '/complaints', icon: <MessageSquare className="w-5 h-5" /> },
  { title: 'التخطيط الدوري', href: '/schedule', icon: <CalendarDays className="w-5 h-5" /> },
  { title: 'القوى العاملة', href: '/workforce', icon: <Users className="w-5 h-5" /> },
  { title: 'المخازن', href: '/inventory', icon: <Package className="w-5 h-5" /> },
  { title: 'السيارات', href: '/vehicles', icon: <Truck className="w-5 h-5" /> },
  {
    title: 'التقارير',
    href: '/reports',
    icon: <FileText className="w-5 h-5" />,
    children: [
      { title: 'النظافة', href: '/reports/cleaning', icon: <Sparkles className="w-4 h-4" /> },
      { title: 'O&M', href: '/reports/om', icon: <Wrench className="w-4 h-4" /> },
      { title: 'التكييف', href: '/reports/hvac', icon: <Wind className="w-4 h-4" /> },
      { title: 'مصور', href: '/reports/photo', icon: <Camera className="w-4 h-4" /> },
    ],
  },
  { title: 'المالية', href: '/finance', icon: <DollarSign className="w-5 h-5" /> },
  { title: 'الإعدادات', href: '/settings', icon: <Settings className="w-5 h-5" /> },
];

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className={depth > 0 ? 'mr-4' : ''}>
      <Link
        href={item.href}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
          isActive
            ? 'bg-ayla-100 text-ayla-700 font-medium'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        {item.icon}
        <span className="flex-1">{item.title}</span>
        {hasChildren && (
          <span className="text-gray-400">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
      </Link>
      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItemComponent key={child.href} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-40 w-72 bg-white border-l border-gray-200 overflow-y-auto transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-ayla-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">آ</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">آيلا</h1>
              <p className="text-xs text-gray-500">منصة الصيانة الذكية</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </nav>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
