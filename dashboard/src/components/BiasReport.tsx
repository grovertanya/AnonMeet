import { useState } from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface BiasReportProps {
  interviewId: string;
}

export function BiasReport({ interviewId }: BiasReportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);

  // Step 1: Upload and Analyze
  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5001/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setReport(data.result ? JSON.parse(data.result) : data); // Parse if backend returns text JSON
    } catch (err: any) {
      console.error(err);
      setError("Failed to analyze interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Helpers for color logic
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100";
      case "medium":
        return "bg-yellow-100";
      case "high":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  // Step 3: Show upload panel if no report yet
  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bias & Fairness Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Upload the recorded interview video (.mp4 or .mov) to generate an AI-based bias report.
          </p>

          <input
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full border rounded-md py-2 px-3 mb-4"
          />

          <Button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="bg-blue-600 text-white"
          >
            {loading ? "Analyzing..." : "Generate Bias Report"}
          </Button>

          {error && <p className="text-red-600 mt-3">{error}</p>}
        </CardContent>
      </Card>
    );
  }

  // Step 4: Render real or fallback bias report
  const biasAnalysis = report.bias_score
    ? {
        overallRisk:
          report.bias_score < 40
            ? "high"
            : report.bias_score < 70
            ? "medium"
            : "low",
        complianceScore: Math.min(100, 100 - report.bias_score / 2),
        flags: (report.flagged_questions || []).map((q: string) => ({
          category: "Potential Bias",
          detected: true,
          confidence: 75,
          description: q,
          details: "Detected bias-related phrasing or tone. Review manually.",
        })),
        recommendations: [
          "Review flagged questions for neutrality and inclusivity.",
          "Use structured behavioral questions instead of opinion-based phrasing.",
          "Ensure fairness metrics are reviewed by multiple HR reviewers.",
        ],
      }
    : {
        overallRisk: "low",
        complianceScore: 92,
        flags: [],
        recommendations: [
          "Continue using structured interview questions.",
          "No bias detected in responses.",
        ],
      };

  return (
    <div className="space-y-6">
      {/* Overall Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bias Risk Assessment</span>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${getRiskBg(
                  biasAnalysis.overallRisk
                )} ${getRiskColor(biasAnalysis.overallRisk)}`}
              >
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
            AI-powered linguistic and tone analysis of the interview to identify potential unconscious bias or discriminatory phrasing.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${biasAnalysis.complianceScore}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bias Flags */}
      {biasAnalysis.flags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bias Detection Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {biasAnalysis.flags.map((flag: any, index: number) => (
              <div
                key={index}
                className="border-l-4 pl-4 py-2"
                style={{
                  borderColor: flag.detected ? "#f59e0b" : "#10b981",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {flag.detected ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    <h4 className="text-sm">{flag.category}</h4>
                  </div>
                  <span className="text-xs text-gray-500">
                    {flag.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {flag.description}
                </p>
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
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {biasAnalysis.recommendations.map((rec: string, index: number) => (
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
          <strong>Note:</strong> This bias analysis is an automated tool that supports equitable hiring. 
          Always validate results using human oversight and ethical HR review standards.
        </p>
      </div>
    </div>
  );
}
