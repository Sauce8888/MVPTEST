'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarRange, CreditCard, Settings, Users, LineChart, Menu, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const isAdmin = session?.user?.isAdmin;
  const baseRoute = isAdmin ? '/admin' : '/host';
  
  const hostLinks = [
    { href: `${baseRoute}`, label: 'Dashboard', icon: Home },
    { href: `${baseRoute}/calendar`, label: 'Calendar', icon: CalendarRange },
    { href: `${baseRoute}/bookings`, label: 'Bookings', icon: CreditCard },
    { href: `${baseRoute}/settings`, label: 'Settings', icon: Settings },
  ];
  
  const adminLinks = [
    { href: `${baseRoute}`, label: 'Dashboard', icon: Home },
    { href: `${baseRoute}/hosts`, label: 'Hosts', icon: Users },
    { href: `${baseRoute}/analytics`, label: 'Analytics', icon: LineChart },
    { href: `${baseRoute}/settings`, label: 'Settings', icon: Settings },
  ];
  
  const links = isAdmin ? adminLinks : hostLinks;
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  
  return (
    <>
      {/* Mobile toggle */}
      <button 
        className="fixed z-20 top-4 left-4 md:hidden text-gray-700 p-2 rounded-md bg-white shadow"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleSidebar()}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      <div className={`fixed inset-y-0 left-0 z-10 transform bg-white shadow-lg w-64 transition-transform duration-200 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">
              {isAdmin ? 'Admin Portal' : 'Host Dashboard'}
            </h1>
          </div>
          
          <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors group ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      tabIndex={0}
                    >
                      <Icon 
                        size={18} 
                        className={`mr-3 ${isActive ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-700'}`} 
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="px-4 py-4 border-t text-sm text-gray-600">
            <p>© 2023 StayDirect</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 