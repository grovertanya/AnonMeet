import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface BiasReportProps {
  interviewId: string;
}

export function BiasReport({ interviewId }: BiasReportProps) {
  // Mock bias analysis data
  const biasAnalysis = {
    overallRisk: 'low', // low, medium, high
    flags: [
      {
        category: 'Gender Bias',
        detected: false,
        confidence: 95,
        description: 'No gender-specific language detected in feedback.',
      },
      {
        category: 'Age Bias',
        detected: false,
        confidence: 92,
        description: 'No age-related references found in evaluation.',
      },
      {
        category: 'Cultural Bias',
        detected: true,
        confidence: 78,
        description: 'Potential cultural bias detected. Feedback references "culture fit" without specific behavioral examples.',
        details: 'Consider using specific competency-based criteria instead of general culture fit assessments.',
      },
      {
        category: 'Halo/Horn Effect',
        detected: false,
        confidence: 88,
        description: 'Evaluation appears balanced across different competencies.',
      },
      {
        category: 'Confirmation Bias',
        detected: false,
        confidence: 85,
        description: 'No evidence of questions designed to confirm preconceptions.',
      },
    ],
    recommendations: [
      'Continue using structured interview questions to minimize bias',
      'Consider adding more specific behavioral examples when assessing culture fit',
      'Review the culture fit criteria to ensure they are based on objective, job-relevant factors',
    ],
    complianceScore: 92,
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100';
      case 'medium':
        return 'bg-yellow-100';
      case 'high':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bias Risk Assessment</span>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${getRiskBg(biasAnalysis.overallRisk)} ${getRiskColor(biasAnalysis.overallRisk)}`}>
                {biasAnalysis.overallRisk.toUpperCase()} RISK
              </span>
              <span className="text-sm text-gray-600">
                Compliance: {biasAnalysis.complianceScore}%
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-4">
            This analysis uses AI to detect potential unconscious bias in interview feedback. The system examines language patterns, assessment consistency, and adherence to structured interview practices.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${biasAnalysis.complianceScore}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bias Flags */}
      <Card>
        <CardHeader>
          <CardTitle>Bias Detection Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {biasAnalysis.flags.map((flag, index) => (
            <div key={index} className="border-l-4 pl-4 py-2" style={{ borderColor: flag.detected ? '#f59e0b' : '#10b981' }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {flag.detected ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  <h4 className="text-sm">{flag.category}</h4>
                </div>
                <span className="text-xs text-gray-500">{flag.confidence}% confidence</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{flag.description}</p>
              {flag.details && (
                <div className="flex items-start gap-2 mt-2 p-3 bg-yellow-50 rounded-md">
                  <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-800">{flag.details}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {biasAnalysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-blue-600 mt-1">→</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> This bias analysis is an automated assessment tool designed to support fair hiring practices. 
          It should be used as one of multiple data points in evaluating interview quality and should not be the sole basis for hiring decisions. 
          Human judgment and context are essential in interpreting these results.
        </p>
      </div>
    </div>
  );
}
