import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface InterviewRoomProps {
  interviewId: string;
  onEndInterview: () => void;
}

export function InterviewRoom({ interviewId, onEndInterview }: InterviewRoomProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [notes, setNotes] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string }[]>([
    { sender: 'System', message: 'Interview started' },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [duration, setDuration] = useState(0);
  const [cameraError, setCameraError] = useState(false);

  // Recording state
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<BlobPart[]>([]);

  // Timer for interview duration
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize camera + start recording
  useEffect(() => {
    if (!isVideoOff) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            // Show video preview
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              setCameraError(false);
            }

            // Start audio recording
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e) => recordedChunks.current.push(e.data);
            recorder.start();
            mediaRecorderRef.current = recorder;
            setRecording(true);
          })
          .catch((err) => {
            console.log('Camera not available:', err.name);
            setCameraError(true);
          });
      } else {
        setCameraError(true);
      }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOff]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setChatMessages([...chatMessages, { sender: 'You', message: currentMessage }]);
      setCurrentMessage('');
    }
  };

  // Stop recording and send to backend
  const handleEndInterview = async () => {
    if (!mediaRecorderRef.current) {
      onEndInterview();
      return;
    }

    setUploading(true);
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(recordedChunks.current, { type: 'audio/mp4' });
      const formData = new FormData();
      formData.append('file', blob, `${interviewId}.mp4`);

      toast.info('Uploading interview for AI analysis...');

      try {
        const res = await fetch('http://127.0.0.1:5001/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      let text = data.result;

      // Clean markdown wrappers like ```json ... ```
      if (typeof text === 'string') {
        text = text.replace(/```json|```/g, '').trim();
        try {
          text = JSON.parse(text);
        } catch {
          console.warn('Could not parse Gemini JSON, saving raw text instead');
        }
      }

      // Save to localStorage
      localStorage.setItem(`report_${interviewId}`, JSON.stringify(text));

      console.log('✅ Clean Bias Analysis:', text);


      } catch (err) {
        console.error('Upload failed', err);
        toast.error('Failed to analyze interview. Please try again.');
      } finally {
        setUploading(false);
        onEndInterview();
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white">Interview with Sarah Johnson</h2>
          <p className="text-sm text-gray-400">Senior Frontend Developer</p>
        </div>
        <div className="text-white">
          <span className="text-red-500">●</span> {formatDuration(duration)}
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Interviewer Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">MC</span>
                </div>
                <p className="text-white">Michael Chen (Interviewer)</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">
              Interviewer
            </div>
          </div>

          {/* Candidate Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            {!isVideoOff && !cameraError ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-white">SJ</span>
                  </div>
                  <p className="text-white">Sarah Johnson (You)</p>
                  {cameraError && !isVideoOff && (
                    <p className="text-xs text-gray-400 mt-2">Camera unavailable</p>
                  )}
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">
              You
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-white h-full flex flex-col">
            <Tabs defaultValue="notes" className="flex-1 flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger value="notes" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
              </TabsList>

              {/* Notes */}
              <TabsContent value="notes" className="flex-1 flex flex-col p-4">
                <h3 className="mb-2">Interview Notes</h3>
                <Textarea
                  placeholder="Take notes during the interview..."
                  className="flex-1 resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </TabsContent>

              {/* Chat */}
              <TabsContent value="chat" className="flex-1 flex flex-col p-4">
                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded ${
                        msg.sender === 'System'
                          ? 'bg-gray-100 text-center text-sm text-gray-600'
                          : msg.sender === 'You'
                          ? 'bg-blue-100 ml-8'
                          : 'bg-gray-100 mr-8'
                      }`}
                    >
                      <p className="text-xs">{msg.sender}</p>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-center gap-4">
        <Button
          variant={isMuted ? 'destructive' : 'secondary'}
          size="lg"
          onClick={() => setIsMuted(!isMuted)}
          className="rounded-full w-12 h-12 p-0"
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        <Button
          variant={isVideoOff ? 'destructive' : 'secondary'}
          size="lg"
          onClick={() => setIsVideoOff(!isVideoOff)}
          className="rounded-full w-12 h-12 p-0"
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </Button>
        <Button
          variant="destructive"
          size="lg"
          onClick={handleEndInterview}
          className="rounded-full px-6"
          disabled={uploading}
        >
          <Phone className="w-5 h-5 mr-2" />
          {uploading ? 'Analyzing...' : 'End Interview'}
        </Button>
      </div>
    </div>
  );
}
