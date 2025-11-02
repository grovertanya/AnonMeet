import { useState } from 'react';
import { ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { Button } from './ui/button';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'in-progress';
  interviewerName: string;
}

interface CalendarViewProps {
  interviews: Interview[];
  onJoinInterview: (id: string) => void;
}

export function CalendarView({ interviews, onJoinInterview }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Group interviews by date
  const interviewsByDate = interviews.reduce((acc, interview) => {
    const dateStr = interview.date;
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(interview);
    return acc;
  }, {} as Record<string, Interview[]>);

  // Generate calendar days
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getDayInterviews = (day: number) => {
    const dateStr = `${monthNames[currentDate.getMonth()].slice(0, 3)} ${day}, ${currentDate.getFullYear()}`;
    return interviewsByDate[dateStr] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="bg-white rounded-lg border">
          {/* Calendar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-4">
              {days.map((day, index) => {
                const dayInterviews = day ? getDayInterviews(day) : [];
                const isToday = day === 2; // Mock today as Nov 2

                return (
                  <div
                    key={index}
                    className={`min-h-32 p-2 rounded-lg border ${
                      day
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-gray-50 border-transparent'
                    } ${isToday ? 'border-blue-500 border-2' : ''}`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm mb-2 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {dayInterviews.map((interview) => (
                            <button
                              key={interview.id}
                              onClick={() => interview.status === 'scheduled' && onJoinInterview(interview.id)}
                              className={`w-full text-left p-2 rounded text-xs ${
                                interview.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <div className="flex items-start gap-1">
                                {interview.status === 'scheduled' && (
                                  <Video className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">{interview.candidateName}</div>
                                  <div className="text-xs opacity-75">{interview.time.split(' - ')[0]}</div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Interviews List */}
        <div className="mt-8">
          <h3 className="mb-4">Upcoming Interviews</h3>
          <div className="bg-white rounded-lg border divide-y">
            {interviews
              .filter(i => i.status === 'scheduled')
              .slice(0, 5)
              .map((interview) => (
                <div key={interview.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="text-sm mb-1">{interview.candidateName}</p>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {interview.date} · {interview.time}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onJoinInterview(interview.id)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
