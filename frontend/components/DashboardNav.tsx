'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiBook, 
  FiClock, 
  FiCalendar, 
  FiUser, 
  FiLogOut, 
  FiHome,
  FiUsers,
  FiBarChart2
} from 'react-icons/fi';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { 
      href: '/dashboard/books', 
      icon: <FiBook />, 
      label: 'Books',
      show: true
    },
    { 
      href: '/dashboard/transactions', 
      icon: <FiClock />, 
      label: 'Transactions',
      show: true
    },
    { 
      href: '/dashboard/reservations', 
      icon: <FiCalendar />, 
      label: 'Reservations',
      show: true
    },
    { 
      href: '/dashboard/users', 
      icon: <FiUsers />, 
      label: 'Users',
      show: user?.is_staff
    },
    { 
      href: '/dashboard/analytics', 
      icon: <FiBarChart2 />, 
      label: 'Analytics',
      show: user?.is_staff
    },
    { 
      href: '/dashboard/profile', 
      icon: <FiUser />, 
      label: 'Profile',
      show: true
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <FiBook className="text-2xl text-primary-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            LibraryHub
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.user_type}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.filter(item => item.show).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              pathname?.startsWith(item.href)
                ? 'bg-primary-50 text-primary-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
