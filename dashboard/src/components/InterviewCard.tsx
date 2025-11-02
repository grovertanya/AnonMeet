import { Calendar, Clock, User, Video, CheckCircle2, Circle, FileText } from 'lucide-react';

interface InterviewCardProps {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'in-progress';
  score?: number;
  interviewerName: string;
  onJoin?: () => void;
  onViewReport?: () => void;
}

export function InterviewCard({
  candidateName,
  position,
  date,
  time,
  status,
  score,
  interviewerName,
  onJoin,
  onViewReport,
}: InterviewCardProps) {
  return (
    <div
      className={`group border-b py-4 px-1 hover:bg-gray-50 transition-all ${
        status === 'completed' ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox/Status Indicator */}
        <div className="pt-1">
          {status === 'completed' ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base mb-1 ${
                  status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {candidateName}
              </h3>
              <p className="text-sm text-gray-600">{position}</p>
            </div>
            {status === 'completed' && score !== undefined && (
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    score >= 75
                      ? 'bg-green-100 text-green-700'
                      : score >= 50
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {score}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{interviewerName}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {status === 'scheduled' && onJoin && (
              <button
                onClick={onJoin}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-sm"
              >
                <Video className="w-4 h-4" />
                Join Interview
              </button>
            )}
            {status === 'completed' && onViewReport && (
              <button
                onClick={onViewReport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all text-sm"
              >
                <FileText className="w-4 h-4" />
                View Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
