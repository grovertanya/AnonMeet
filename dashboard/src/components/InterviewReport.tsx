import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BiasReport } from './BiasReport';
import { useEffect, useState } from 'react';

interface Section {
  name: string;
  trend?: string;
  score?: number;
  notes?: string;
}

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  interviewerName: string;
}

interface InterviewReportProps {
  interviewId: string;
  onBack: () => void;
  showBiasReport?: boolean;
}

export function InterviewReport({ interviewId, onBack, showBiasReport = false }: InterviewReportProps) {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    // ✅ pull mockInterviews from localStorage or window memory (set by App)
    const storedInterviews = localStorage.getItem('interviews');
    if (storedInterviews) {
      const parsed = JSON.parse(storedInterviews);
      const match = parsed.find((i: Interview) => i.id === interviewId);
      if (match) setInterview(match);
    }

    const savedReport = localStorage.getItem(`report_${interviewId}`);
    if (savedReport) {
      try {
        setReport(JSON.parse(savedReport));
      } catch {
        console.warn('⚠️ Failed to parse saved report');
      }
    }
  }, [interviewId]);

  // ✅ fallback template merged with dynamic interview data
  const mergedReport = {
    candidateName: interview?.candidateName ?? 'Candidate',
    position: interview?.position ?? 'N/A',
    interviewer: interview?.interviewerName ?? 'N/A',
    date: interview?.date ?? new Date().toLocaleDateString(),
    duration: report?.duration ?? 'N/A',
    overallScore: report?.overallScore ?? 0,
    sections: report?.sections ?? [],
    strengths: report?.strengths ?? ['Awaiting AI report...'],
    improvements: report?.improvements ?? [],
    recommendation: report?.recommendation ?? 'Pending',
    nextSteps: report?.nextSteps ?? 'Report will appear after analysis completes.',
    interviewerComments: report?.interviewerComments ?? 'No analysis yet.',
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

  const getTrendIcon = (trend?: string) => {
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
              <p className="text-gray-600">
                {mergedReport.candidateName} · {mergedReport.position}
              </p>
            </div>
            <div className={`text-4xl ${getScoreColor(mergedReport.overallScore)}`}>
              {mergedReport.overallScore ?? 0}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Date</p>
              <p>{mergedReport.date}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Interviewer</p>
              <p>{mergedReport.interviewer}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Duration</p>
              <p>{mergedReport.duration}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Recommendation</p>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {mergedReport.recommendation}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {showBiasReport ? (
          <Tabs defaultValue="performance" className="mb-6">
            <TabsList className="mb-6">
              <TabsTrigger value="performance">Performance Report</TabsTrigger>
              <TabsTrigger value="bias">Bias Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="performance">
              {/* Performance Breakdown */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mergedReport.sections.length > 0 ? (
                    mergedReport.sections.map((section: Section, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm">{section.name}</h4>
                            {getTrendIcon(section.trend)}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${getScoreBgColor(
                              section.score ?? 0
                            )} ${getScoreColor(section.score ?? 0)}`}
                          >
                            {section.score ?? 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${section.score ?? 0}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">{section.notes ?? ''}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No detailed sections available.</p>
                  )}
                </CardContent>
              </Card>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mergedReport.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {mergedReport.strengths.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600 mt-1">✓</span>
                            <span className="text-gray-700">{s}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No strengths listed.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mergedReport.improvements.length > 0 ? (
                      <ul className="space-y-2">
                        {mergedReport.improvements.map((i: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-yellow-600 mt-1">!</span>
                            <span className="text-gray-700">{i}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No improvement areas found.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Interviewer Comments */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Interviewer Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {mergedReport.interviewerComments}
                  </p>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{mergedReport.nextSteps}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bias">
              <BiasReport interviewId={interviewId} />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* Fallback if no Bias tab */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mergedReport.sections.length > 0 ? (
                  mergedReport.sections.map((section: Section, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm">{section.name}</h4>
                          {getTrendIcon(section.trend)}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getScoreBgColor(
                            section.score ?? 0
                          )} ${getScoreColor(section.score ?? 0)}`}
                        >
                          {section.score ?? 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${section.score ?? 0}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{section.notes ?? ''}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No performance data yet.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
