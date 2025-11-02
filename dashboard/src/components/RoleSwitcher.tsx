import { User, UserCheck, Users } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: 'interviewee' | 'interviewer' | 'hr';
  onRoleChange: (role: 'interviewee' | 'interviewer' | 'hr') => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
      <span className="text-xs text-gray-600 mr-1">View as:</span>
      <button
        onClick={() => onRoleChange('interviewee')}
        className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-2 transition-all ${
          currentRole === 'interviewee'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <User className="w-3.5 h-3.5" />
        Candidate
      </button>
      <button
        onClick={() => onRoleChange('interviewer')}
        className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-2 transition-all ${
          currentRole === 'interviewer'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <UserCheck className="w-3.5 h-3.5" />
        Interviewer
      </button>
      <button
        onClick={() => onRoleChange('hr')}
        className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-2 transition-all ${
          currentRole === 'hr'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        HR
      </button>
    </div>
  );
}
