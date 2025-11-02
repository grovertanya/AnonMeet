import { useState, useEffect } from 'react';
import { Calendar, Clock, Circle, CheckCircle2, FileText, Video } from 'lucide-react';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'in-progress';
  feedbackSubmitted?: boolean;
}

interface InterviewerDashboardProps {
  onJoinInterview: (id: string) => void;
  onProvideFeedback: (id: string) => void;
  onViewReport: (id: string) => void;
}

export function InterviewerDashboard({
  onJoinInterview,
  onProvideFeedback,
  onViewReport,
}: InterviewerDashboardProps) {
  const [activeView, setActiveView] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [interviews, setInterviews] = useState<Interview[]>([]);

  //  Load shared interviews from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('interviews');
    if (stored) {
      try {
        setInterviews(JSON.parse(stored));
      } catch {
        console.warn('⚠️ Failed to parse stored interviews');
      }
    }
  }, []);

  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled');
  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const pendingFeedback = completedInterviews.filter((i) => !i.feedbackSubmitted);

  const displayInterviews =
    activeView === 'scheduled'
      ? scheduledInterviews
      : activeView === 'completed'
      ? completedInterviews
      : interviews;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl mb-2 tracking-tight">My Interviews</h1>
              <p className="text-gray-600">
                {scheduledInterviews.length} upcoming · {pendingFeedback.length} pending feedback
              </p>
            </div>
          </div>

          {/* Pending Feedback Alert */}
          {pendingFeedback.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                You have {pendingFeedback.length} interview
                {pendingFeedback.length !== 1 ? 's' : ''} pending feedback submission.
              </p>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b">
            {['all', 'scheduled', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveView(tab as 'all' | 'scheduled' | 'completed')}
                className={`px-4 py-2 border-b-2 transition-all flex items-center gap-2 text-sm ${
                  activeView === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'scheduled' && <Circle className="w-4 h-4" />}
                {tab === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                {tab === 'all' && <span>All</span>}
                {tab !== 'all' && (
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                    {tab === 'scheduled' ? scheduledInterviews.length : completedInterviews.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Interview List */}
        <div className="bg-white rounded-lg border">
          {displayInterviews.length > 0 ? (
            <div className="px-6">
              {displayInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className={`group border-b py-4 px-1 hover:bg-gray-50 transition-all ${
                    interview.status === 'completed' && interview.feedbackSubmitted
                      ? 'opacity-60'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="pt-1">
                      {interview.status === 'completed' && interview.feedbackSubmitted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : interview.status === 'completed' && !interview.feedbackSubmitted ? (
                        <Circle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                      )}
                    </div>

                    {/* Main Card */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base mb-1 text-gray-900">
                            {interview.candidateName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">{interview.position}</p>
                          {interview.status === 'completed' && !interview.feedbackSubmitted && (
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                              Feedback Pending
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{interview.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{interview.time}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {interview.status === 'scheduled' && (
                          <button
                            onClick={() => onJoinInterview(interview.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-sm"
                          >
                            <Video className="w-4 h-4" />
                            Join Interview
                          </button>
                        )}

                        {interview.status === 'completed' && (
                          <>
                            <button
                              onClick={() => onProvideFeedback(interview.id)}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm ${
                                interview.feedbackSubmitted
                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              <FileText className="w-4 h-4" />
                              {interview.feedbackSubmitted
                                ? 'View Feedback'
                                : 'Provide Feedback'}
                            </button>

                            {/* ✅ View Report Button (shared for all roles) */}
                            <button
                              onClick={() => onViewReport(interview.id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-all text-sm"
                            >
                              <FileText className="w-4 h-4" />
                              View Report
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
