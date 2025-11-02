import { useState } from 'react';
import { Search, Filter, TrendingUp, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'in-progress';
  score?: number;
  feedbackSubmitted?: boolean;
  biasFlags?: number;
}

interface HRDashboardProps {
  onViewReport: (id: string) => void;
}

const mockHRInterviews: Interview[] = [
  {
    id: '4',
    candidateName: 'Robert Brown',
    position: 'Backend Engineer',
    date: 'Oct 30, 2025',
    interviewer: 'Lisa Anderson',
    status: 'completed',
    score: 85,
    feedbackSubmitted: true,
    biasFlags: 0,
  },
  {
    id: '5',
    candidateName: 'Jennifer Lee',
    position: 'Data Scientist',
    date: 'Oct 28, 2025',
    interviewer: 'Michael Chen',
    status: 'completed',
    score: 92,
    feedbackSubmitted: true,
    biasFlags: 0,
  },
  {
    id: '6',
    candidateName: 'Thomas Martinez',
    position: 'DevOps Engineer',
    date: 'Oct 27, 2025',
    interviewer: 'Emily Rodriguez',
    status: 'completed',
    score: 78,
    feedbackSubmitted: true,
    biasFlags: 1,
  },
  {
    id: '7',
    candidateName: 'Amanda White',
    position: 'Marketing Manager',
    date: 'Oct 26, 2025',
    interviewer: 'David Kim',
    status: 'completed',
    score: 88,
    feedbackSubmitted: true,
    biasFlags: 0,
  },
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    position: 'Senior Frontend Developer',
    date: 'Nov 2, 2025',
    interviewer: 'Michael Chen',
    status: 'scheduled',
  },
  {
    id: '2',
    candidateName: 'James Wilson',
    position: 'Product Manager',
    date: 'Nov 2, 2025',
    interviewer: 'Emily Rodriguez',
    status: 'scheduled',
  },
];

export function HRDashboard({ onViewReport }: HRDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const completedInterviews = mockHRInterviews.filter(i => i.status === 'completed');
  const scheduledInterviews = mockHRInterviews.filter(i => i.status === 'scheduled');
  const biasFlags = completedInterviews.reduce((sum, i) => sum + (i.biasFlags || 0), 0);
  const avgScore = completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / completedInterviews.length;

  const filteredInterviews = mockHRInterviews.filter(
    (interview) =>
      interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 tracking-tight">Interview Analytics</h1>
          <p className="text-gray-600">Monitor and analyze all interviews across the organization</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Interviews</p>
                  <p className="text-2xl">{mockHRInterviews.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Score</p>
                  <p className="text-2xl">{avgScore.toFixed(0)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl">{completedInterviews.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bias Flags</p>
                  <p className="text-2xl">{biasFlags}</p>
                </div>
                <AlertTriangle className={`w-8 h-8 ${biasFlags > 0 ? 'text-yellow-600' : 'text-gray-400'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by candidate, position, or interviewer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <button className="px-4 py-2 border rounded-md flex items-center gap-2 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Interviews Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm">Candidate</th>
                    <th className="text-left py-3 px-4 text-sm">Position</th>
                    <th className="text-left py-3 px-4 text-sm">Date</th>
                    <th className="text-left py-3 px-4 text-sm">Interviewer</th>
                    <th className="text-left py-3 px-4 text-sm">Status</th>
                    <th className="text-left py-3 px-4 text-sm">Score</th>
                    <th className="text-left py-3 px-4 text-sm">Bias</th>
                    <th className="text-left py-3 px-4 text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterviews.map((interview) => (
                    <tr key={interview.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{interview.candidateName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{interview.position}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{interview.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{interview.interviewer}</td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            interview.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {interview.status === 'completed' ? 'Completed' : 'Scheduled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {interview.score ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              interview.score >= 80
                                ? 'bg-green-100 text-green-700'
                                : interview.score >= 60
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {interview.score}%
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {interview.biasFlags !== undefined ? (
                          interview.biasFlags > 0 ? (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                              {interview.biasFlags} flag{interview.biasFlags !== 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {interview.status === 'completed' && (
                          <button
                            onClick={() => onViewReport(interview.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Report
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
