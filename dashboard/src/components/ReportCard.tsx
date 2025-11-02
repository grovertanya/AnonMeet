import BiasChart from "./BiasChart";

interface Props {
  result: {
    bias_score: number;
    flagged_questions: string[];
    tone_summary: string;
    overall_feedback: string;
  };
  onReset: () => void;
}

export default function ReportCard({ result, onReset }: Props) {
  return (
    <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-2xl border mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Interview Analysis Report</h2>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:underline"
        >
          New Upload
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex justify-center items-center">
          <BiasChart score={result.bias_score} />
        </div>

        <div className="md:w-2/3 space-y-4">
          <p><strong>Tone Summary:</strong> {result.tone_summary}</p>
          <p><strong>Overall Feedback:</strong> {result.overall_feedback}</p>

          {result.flagged_questions.length > 0 && (
            <div>
              <strong>Flagged Questions:</strong>
              <ul className="list-disc ml-6">
                {result.flagged_questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
