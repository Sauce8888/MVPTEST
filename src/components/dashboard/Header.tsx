'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface HeaderProps {
  user: {
    id: string;
    email: string | null;
    name?: string | null;
    isAdmin: boolean;
  } | null;
}

const Header = ({ user }: HeaderProps) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  const handleSignOut = async () => {
    await signOut();
    // No need to redirect here, as signOut already handles redirection
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleProfile();
    }
  };
  
  if (!user) return null;
  
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-medium text-gray-800">
          {user.isAdmin ? 'Admin Dashboard' : 'Host Dashboard'}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Notifications"
          tabIndex={0}
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        <div className="relative">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={toggleProfile}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-expanded={isProfileOpen}
            aria-label="Open user menu"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <UserIcon size={16} />
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
              <button
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleSignOut}
                tabIndex={0}
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 