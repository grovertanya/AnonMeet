import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { InterviewRoom } from './components/InterviewRoom';
import { CalendarView } from './components/CalendarView';
import { Profile } from './components/Profile';
import { InterviewReport } from './components/InterviewReport';
import { InterviewerDashboard } from './components/InterviewerDashboard';
import { FeedbackForm } from './components/FeedbackForm';
import { HRDashboard } from './components/HRDashboard';
import { Toaster } from './components/ui/sonner';
import { httpClient } from './services/httpClient';
import { toast } from 'sonner';

type Page = 'dashboard' | 'interview' | 'calendar' | 'profile' | 'report' | 'feedback';
type Role = 'interviewee' | 'interviewer' | 'hr';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('interviewee');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // ✅ Check backend connection once on load
  const checkBackendConnection = async () => {
    try {
      const response = await httpClient.get('/health');
      if (response.status === 200 || response.data?.status === 'ok') {
        setBackendStatus('connected');
        toast.success('✅ Connected to backend server');
      } else {
        setBackendStatus('disconnected');
        toast.error('⚠️ Backend responded unexpectedly');
      }
    } catch (error) {
      setBackendStatus('disconnected');
      toast.error('🚨 Backend server not reachable');
      console.error('Backend connection error:', error);
    }
  };

  useEffect(() => {
    checkBackendConnection();
  }, []);

  // ✅ Mock interview data
  const [mockInterviews, setMockInterviews] = useState([
    {
      id: '1',
      candidateName: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      date: 'Nov 2, 2025',
      time: '10:00 AM - 11:00 AM',
      status: 'scheduled' as const,
      interviewerName: 'Michael Chen',
    },
    {
      id: '2',
      candidateName: 'James Wilson',
      position: 'Product Manager',
      date: 'Nov 2, 2025',
      time: '2:00 PM - 3:00 PM',
      status: 'scheduled' as const,
      interviewerName: 'Emily Rodriguez',
    },
    {
      id: '3',
      candidateName: 'Maria Garcia',
      position: 'UX Designer',
      date: 'Nov 3, 2025',
      time: '11:00 AM - 12:00 PM',
      status: 'scheduled' as const,
      interviewerName: 'David Kim',
    },
    {
      id: '4',
      candidateName: 'Robert Brown',
      position: 'Backend Engineer',
      date: 'Oct 30, 2025',
      time: '3:00 PM - 4:00 PM',
      status: 'completed' as const,
      score: 85,
      interviewerName: 'Lisa Anderson',
    },
    {
      id: '5',
      candidateName: 'Jennifer Lee',
      position: 'Data Scientist',
      date: 'Oct 28, 2025',
      time: '1:00 PM - 2:00 PM',
      status: 'completed' as const,
      score: 92,
      interviewerName: 'Michael Chen',
    },
  ]);

  useEffect(() => {
    localStorage.setItem('interviews', JSON.stringify(mockInterviews));
  }, [mockInterviews]);

  // ✅ Handlers
  const handleJoinInterview = async (interviewId: string) => {
    if (backendStatus === 'disconnected') {
      toast.error('Cannot join meeting — server not available.');
      return;
    }

    try {
      await httpClient.post(`/meetings/${interviewId}/join`, {
        participantId: `user-${Date.now()}`,
        name: currentRole === 'interviewer' ? 'Interviewer' : 'Candidate',
      });

      setCurrentInterviewId(interviewId);
      setCurrentPage('interview');
    } catch (error) {
      console.error('Failed to join meeting:', error);
      toast.error('Failed to join meeting. Please try again.');
    }
  };

  const handleEndInterview = async (interviewId: string) => {
    try {
      await httpClient.post(`/meetings/${interviewId}/leave`, {
        participantId: `user-${Date.now()}`,
      });
    } catch (error) {
      console.error('Failed to leave meeting:', error);
    }

    setMockInterviews((prev) =>
      prev.map((int) =>
        int.id === interviewId ? { ...int, status: 'completed', score: 0 } : int
      )
    );

    setCurrentInterviewId(null);
    setCurrentPage('dashboard');
  };

  const handleViewReport = (interviewId: string) => {
    setCurrentInterviewId(interviewId);
    setCurrentPage('report');
  };

  const handleProvideFeedback = (interviewId: string) => {
    setCurrentInterviewId(interviewId);
    setCurrentPage('feedback');
  };

  const handleBackToDashboard = () => {
    setCurrentInterviewId(null);
    setCurrentPage('dashboard');
  };

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    setCurrentPage('dashboard');
    setCurrentInterviewId(null);
  };

  const getCurrentInterview = () => mockInterviews.find((i) => i.id === currentInterviewId);

  // ✅ Render
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Backend Status Banner */}
      {backendStatus === 'disconnected' && (

      {/* Backend Status Banner */}
      {backendStatus === 'disconnected' && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm">
          Server disconnected. Please start the backend.
          <button onClick={checkBackendConnection} className="ml-4 underline hover:no-underline">
          Server disconnected. Please start the backend.
          <button onClick={checkBackendConnection} className="ml-4 underline hover:no-underline">
            Retry
          </button>
        </div>
      )}


      {currentPage !== 'interview' && currentPage !== 'report' && currentPage !== 'feedback' && (
        <Header
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
        />
      )}

      {/* INTERVIEWEE */}
      {currentRole === 'interviewee' && (
        <>
          {currentPage === 'dashboard' && (
            <Dashboard
              interviews={mockInterviews}
              onJoinInterview={handleJoinInterview}
              onViewReport={handleViewReport}
            />
          )}
          {currentPage === 'calendar' && <CalendarView interviews={mockInterviews} onJoinInterview={handleJoinInterview} />}
          {currentPage === 'calendar' && <CalendarView interviews={mockInterviews} onJoinInterview={handleJoinInterview} />}
          {currentPage === 'profile' && <Profile />}
        </>
      )}

      {/* INTERVIEWER */}
      {currentRole === 'interviewer' && (
        <>
          {currentPage === 'dashboard' && (
            <InterviewerDashboard
              onJoinInterview={handleJoinInterview}
              onProvideFeedback={handleProvideFeedback}
              onViewReport={handleViewReport}
            />
          )}
          {currentPage === 'calendar' && <CalendarView interviews={mockInterviews} onJoinInterview={handleJoinInterview} />}
          {currentPage === 'calendar' && <CalendarView interviews={mockInterviews} onJoinInterview={handleJoinInterview} />}
          {currentPage === 'feedback' && currentInterviewId && (() => {
            const interview = getCurrentInterview();
            return interview ? (
              <FeedbackForm
                interviewId={currentInterviewId}
                candidateName={interview.candidateName}
                position={interview.position}
                onBack={handleBackToDashboard}
              />
            ) : null;
          })()}
        </>
      )}

      {/* HR */}
      {currentRole === 'hr' && (
        <>
          {currentPage === 'dashboard' && <HRDashboard onViewReport={handleViewReport} />}
          {currentPage === 'calendar' && <CalendarView interviews={mockInterviews} onJoinInterview={handleJoinInterview} />}
          {currentPage === 'calendar' && <CalendarView interviews={mockInterviews} onJoinInterview={handleJoinInterview} />}
        </>
      )}

      {/* SHARED */}
      {currentPage === 'interview' && currentInterviewId && (
        <InterviewRoom interviewId={currentInterviewId} onEndInterview={() => handleEndInterview(currentInterviewId)} />
      )}

      {currentPage === 'report' && currentInterviewId && (
        <InterviewReport
          interviewId={currentInterviewId}
          onBack={handleBackToDashboard}
          showBiasReport={currentRole === 'hr'}
        />
      )}
    </div>
  );
}

