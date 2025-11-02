interface Props {
    score: number;
  }
  
  export default function BiasChart({ score }: Props) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
  
    return (
      <div className="relative w-40 h-40">
        <svg width="160" height="160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#2563eb"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <p className="text-3xl font-bold text-blue-700">{score}</p>
          <p className="text-sm text-gray-500">Bias Score</p>
        </div>
      </div>
    );
  }
  