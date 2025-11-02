import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BiasReport } from './BiasReport';

interface InterviewReportProps {
  interviewId: string;
  onBack: () => void;
  showBiasReport?: boolean;
}

export function InterviewReport({ interviewId, onBack, showBiasReport = false }: InterviewReportProps) {
  // Mock data - in real app this would be fetched based on interviewId
  const report = {
    candidateName: 'Robert Brown',
    position: 'Backend Engineer',
    date: 'Oct 30, 2025',
    interviewer: 'Lisa Anderson',
    duration: '58 minutes',
    overallScore: 85,
    sections: [
      {
        name: 'Technical Skills',
        score: 90,
        trend: 'up',
        notes: 'Strong understanding of system design and architecture. Excellent problem-solving approach.',
      },
      {
        name: 'Communication',
        score: 80,
        trend: 'neutral',
        notes: 'Clear and concise explanations. Could improve on asking clarifying questions earlier.',
      },
      {
        name: 'Problem Solving',
        score: 88,
        trend: 'up',
        notes: 'Demonstrated excellent analytical thinking. Broke down complex problems effectively.',
      },
      {
        name: 'Cultural Fit',
        score: 82,
        trend: 'neutral',
        notes: 'Good alignment with company values. Shows enthusiasm for collaborative work.',
      },
    ],
    strengths: [
      'Deep knowledge of backend technologies and microservices architecture',
      'Strong problem-solving skills with systematic approach',
      'Good understanding of scalability and performance optimization',
      'Experience with cloud platforms and DevOps practices',
    ],
    improvements: [
      'Could be more proactive in asking clarifying questions',
      'Would benefit from more frontend integration knowledge',
      'Communication of time complexity analysis could be clearer',
    ],
    recommendation: 'Strong Hire',
    nextSteps: 'Proceed to final round with engineering director',
    interviewerComments: 'Robert demonstrated strong technical capabilities and a methodical approach to problem-solving. He has extensive experience with the technologies we use and showed genuine interest in our projects. His answers were well-structured and he handled edge cases thoughtfully. Would be a great addition to the backend team.',
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-2">Interview Report</h1>
              <p className="text-gray-600">{report.candidateName} · {report.position}</p>
            </div>
            <div className={`text-4xl ${getScoreColor(report.overallScore)}`}>
              {report.overallScore}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Date</p>
              <p>{report.date}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Interviewer</p>
              <p>{report.interviewer}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Duration</p>
              <p>{report.duration}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Recommendation</p>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {report.recommendation}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs for Report Sections */}
        {showBiasReport ? (
          <Tabs defaultValue="performance" className="mb-6">
            <TabsList className="mb-6">
              <TabsTrigger value="performance">Performance Report</TabsTrigger>
              <TabsTrigger value="bias">Bias Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="performance">
              {/* Score Breakdown */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {report.sections.map((section, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm">{section.name}</h4>
                          {getTrendIcon(section.trend)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getScoreBgColor(section.score)} ${getScoreColor(section.score)}`}>
                          {section.score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${section.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{section.notes}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle>Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Areas for Improvement */}
                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-yellow-600 mt-1">!</span>
                          <span className="text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Interviewer Comments */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Interviewer Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{report.interviewerComments}</p>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{report.nextSteps}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bias">
              <BiasReport interviewId={interviewId} />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* Score Breakdown */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {report.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm">{section.name}</h4>
                        {getTrendIcon(section.trend)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getScoreBgColor(section.score)} ${getScoreColor(section.score)}`}>
                        {section.score}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${section.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{section.notes}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {!showBiasReport && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle>Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle>Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-yellow-600 mt-1">!</span>
                        <span className="text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Interviewer Comments */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Interviewer Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{report.interviewerComments}</p>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{report.nextSteps}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
