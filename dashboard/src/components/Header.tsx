import { Calendar, LayoutDashboard, Settings, User } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';

interface HeaderProps {
  currentPage: 'dashboard' | 'interview' | 'calendar' | 'profile';
  onNavigate: (page: 'dashboard' | 'interview' | 'calendar' | 'profile') => void;
  currentRole: 'interviewee' | 'interviewer' | 'hr';
  onRoleChange: (role: 'interviewee' | 'interviewer' | 'hr') => void;
}

export function Header({ currentPage, onNavigate, currentRole, onRoleChange }: HeaderProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl tracking-tight">InterviewHub</h1>
            <nav className="flex gap-1">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                  currentPage === 'dashboard'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </button>
              <button
                onClick={() => onNavigate('calendar')}
                className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                  currentPage === 'calendar'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Calendar</span>
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
              <Settings className="w-5 h-5" />
            </button>
            {currentRole === 'interviewee' && (
              <button 
                onClick={() => onNavigate('profile')}
                className={`p-2 rounded-md transition-all ${
                  currentPage === 'profile'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
