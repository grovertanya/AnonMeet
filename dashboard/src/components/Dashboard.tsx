import { useState } from 'react';
import { InterviewCard } from './InterviewCard';
import { CheckCircle2, Circle, Plus } from 'lucide-react';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'in-progress';
  score?: number;
  interviewerName: string;
}

interface DashboardProps {
  onJoinInterview: (id: string) => void;
  onViewReport: (id: string) => void;
}

// Mock data
const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    position: 'Senior Frontend Developer',
    date: 'Nov 2, 2025',
    time: '10:00 AM - 11:00 AM',
    status: 'scheduled',
    interviewerName: 'Michael Chen',
  },
  {
    id: '2',
    candidateName: 'James Wilson',
    position: 'Product Manager',
    date: 'Nov 2, 2025',
    time: '2:00 PM - 3:00 PM',
    status: 'scheduled',
    interviewerName: 'Emily Rodriguez',
  },
  {
    id: '3',
    candidateName: 'Maria Garcia',
    position: 'UX Designer',
    date: 'Nov 3, 2025',
    time: '11:00 AM - 12:00 PM',
    status: 'scheduled',
    interviewerName: 'David Kim',
  },
  {
    id: '4',
    candidateName: 'Robert Brown',
    position: 'Backend Engineer',
    date: 'Oct 30, 2025',
    time: '3:00 PM - 4:00 PM',
    status: 'completed',
    score: 85,
    interviewerName: 'Lisa Anderson',
  },
  {
    id: '5',
    candidateName: 'Jennifer Lee',
    position: 'Data Scientist',
    date: 'Oct 28, 2025',
    time: '1:00 PM - 2:00 PM',
    status: 'completed',
    score: 92,
    interviewerName: 'Michael Chen',
  },
  {
    id: '6',
    candidateName: 'Thomas Martinez',
    position: 'DevOps Engineer',
    date: 'Oct 27, 2025',
    time: '10:00 AM - 11:00 AM',
    status: 'completed',
    score: 78,
    interviewerName: 'Emily Rodriguez',
  },
  {
    id: '7',
    candidateName: 'Amanda White',
    position: 'Marketing Manager',
    date: 'Oct 26, 2025',
    time: '2:00 PM - 3:00 PM',
    status: 'completed',
    score: 88,
    interviewerName: 'David Kim',
  },
];

export function Dashboard({ onJoinInterview, onViewReport }: DashboardProps) {
  const [activeView, setActiveView] = useState<'all' | 'scheduled' | 'completed'>('all');

  const scheduledInterviews = mockInterviews.filter(i => i.status === 'scheduled');
  const completedInterviews = mockInterviews.filter(i => i.status === 'completed');

  const displayInterviews = 
    activeView === 'scheduled' 
      ? scheduledInterviews 
      : activeView === 'completed'
      ? completedInterviews
      : mockInterviews;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl mb-2 tracking-tight">Interviews</h1>
              <p className="text-gray-600">
                {scheduledInterviews.length} scheduled · {completedInterviews.length} completed
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Schedule Interview
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveView('all')}
              className={`px-4 py-2 border-b-2 transition-all text-sm ${
                activeView === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveView('scheduled')}
              className={`px-4 py-2 border-b-2 transition-all flex items-center gap-2 text-sm ${
                activeView === 'scheduled'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Circle className="w-4 h-4" />
              Scheduled
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {scheduledInterviews.length}
              </span>
            </button>
            <button
              onClick={() => setActiveView('completed')}
              className={`px-4 py-2 border-b-2 transition-all flex items-center gap-2 text-sm ${
                activeView === 'completed'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Completed
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {completedInterviews.length}
              </span>
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg border">
          {displayInterviews.length > 0 ? (
            <div className="px-6">
              {displayInterviews.map((interview, index) => (
                <InterviewCard
                  key={interview.id}
                  {...interview}
                  onJoin={interview.status === 'scheduled' ? () => onJoinInterview(interview.id) : undefined}
                  onViewReport={interview.status === 'completed' ? () => onViewReport(interview.id) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500">
              <p>No interviews found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
