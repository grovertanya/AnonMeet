import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface FeedbackFormProps {
  interviewId: string;
  candidateName: string;
  position: string;
  onBack: () => void;
}

const surveyQuestions = [
  {
    id: 'technical',
    question: 'Technical Skills & Knowledge',
    description: 'How well did the candidate demonstrate technical competency?',
  },
  {
    id: 'communication',
    question: 'Communication Skills',
    description: 'How effectively did the candidate communicate their ideas?',
  },
  {
    id: 'problem-solving',
    question: 'Problem Solving Ability',
    description: 'How well did the candidate approach and solve problems?',
  },
  {
    id: 'cultural-fit',
    question: 'Cultural Fit',
    description: 'How well would the candidate fit with our company culture?',
  },
  {
    id: 'experience',
    question: 'Relevant Experience',
    description: 'How relevant is the candidate\'s experience to this role?',
  },
];

export function FeedbackForm({ interviewId, candidateName, position, onBack }: FeedbackFormProps) {
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const handleRatingChange = (questionId: string, value: string) => {
    setRatings({ ...ratings, [questionId]: value });
  };

  const handleSubmit = () => {
    // Validate all questions are answered
    if (Object.keys(ratings).length !== surveyQuestions.length) {
      toast.error('Please answer all questions');
      return;
    }
    if (!recommendation) {
      toast.error('Please provide a recommendation');
      return;
    }

    // In a real app, this would submit to backend
    toast.success('Feedback submitted successfully');
    setTimeout(() => onBack(), 1500);
  };

  const ratingOptions = [
    { value: '1', label: '1 - Poor' },
    { value: '2', label: '2 - Below Average' },
    { value: '3', label: '3 - Average' },
    { value: '4', label: '4 - Good' },
    { value: '5', label: '5 - Excellent' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl mb-2 tracking-tight">Interview Feedback</h1>
          <p className="text-gray-600">
            {candidateName} · {position}
          </p>
        </div>

        {/* Survey Questions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance Evaluation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {surveyQuestions.map((question) => (
              <div key={question.id} className="space-y-3">
                <div>
                  <h4 className="mb-1">{question.question}</h4>
                  <p className="text-sm text-gray-600">{question.description}</p>
                </div>
                <RadioGroup
                  value={ratings[question.id]}
                  onValueChange={(value) => handleRatingChange(question.id, value)}
                >
                  <div className="flex gap-4">
                    {ratingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                        <Label htmlFor={`${question.id}-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overall Recommendation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overall Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={recommendation} onValueChange={setRecommendation}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="strong-hire" id="strong-hire" />
                  <Label htmlFor="strong-hire" className="cursor-pointer">
                    <span className="text-green-700">Strong Hire</span> - Exceptional candidate, recommend moving forward immediately
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hire" id="hire" />
                  <Label htmlFor="hire" className="cursor-pointer">
                    <span className="text-blue-700">Hire</span> - Good candidate, recommend moving to next round
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="maybe" />
                  <Label htmlFor="maybe" className="cursor-pointer">
                    <span className="text-yellow-700">Maybe</span> - Uncertain, needs further evaluation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-hire" id="no-hire" />
                  <Label htmlFor="no-hire" className="cursor-pointer">
                    <span className="text-red-700">No Hire</span> - Not a good fit, recommend declining
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Please provide detailed feedback about the candidate's performance, strengths, areas for improvement, and any other observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px]"
            />
            <p className="text-xs text-gray-500 mt-2">
              Your feedback will be used to evaluate the candidate and improve our hiring process.
            </p>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
