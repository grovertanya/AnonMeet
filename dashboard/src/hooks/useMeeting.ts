// hooks/useMeeting.ts
import { useState, useEffect, useCallback } from 'react';
import { meetingService } from '../services/meeting.service';
import { Participant } from '../services/webrtc.service';

interface UseMeetingProps {
  meetingId: string;
  userName?: string;
}

export function useMeeting({ meetingId, userName = 'Anonymous' }: UseMeetingProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Join meeting
  const joinMeeting = useCallback(async () => {
    try {
      setError(null);
      const stream = await meetingService.joinMeeting(meetingId, {
        video: true,
        audio: true,
      });
      
      setLocalStream(stream);
      setIsConnected(true);

      // Setup remote stream handler
      meetingService.onRemoteStream((participantId, remoteStream) => {
        setParticipants(prev => {
          const updated = new Map(prev);
          const participant = updated.get(participantId);
          if (participant) {
            participant.stream = remoteStream;
            updated.set(participantId, participant);
          }
          return updated;
        });
      });

      // Handle participant joined
      meetingService.onParticipantJoined((data) => {
        setParticipants(prev => {
          const updated = new Map(prev);
          updated.set(data.participantId, {
            id: data.participantId,
            name: data.name,
            isAudioEnabled: true,
            isVideoEnabled: true,
          });
          return updated;
        });
      });

      // Handle participant left
      meetingService.onParticipantLeft((data) => {
        setParticipants(prev => {
          const updated = new Map(prev);
          updated.delete(data.participantId);
          return updated;
        });
      });

    } catch (err: any) {
      setError(err.message || 'Failed to join meeting');
      console.error('Join meeting error:', err);
    }
  }, [meetingId]);

  // Leave meeting
  const leaveMeeting = useCallback(async () => {
    try {
      await meetingService.leaveMeeting();
      setLocalStream(null);
      setIsConnected(false);
      setParticipants(new Map());
    } catch (err: any) {
      console.error('Leave meeting error:', err);
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    const newState = !isAudioEnabled;
    meetingService.toggleAudio(newState);
    setIsAudioEnabled(newState);
  }, [isAudioEnabled]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    const newState = !isVideoEnabled;
    meetingService.toggleVideo(newState);
    setIsVideoEnabled(newState);
  }, [isVideoEnabled]);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        meetingService.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await meetingService.startScreenShare();
        setIsScreenSharing(true);
      }
    } catch (err: any) {
      console.error('Screen share error:', err);
      setError('Failed to start screen sharing');
    }
  }, [isScreenSharing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        leaveMeeting();
      }
    };
  }, [isConnected, leaveMeeting]);

  return {
    localStream,
    participants,
    isConnected,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    error,
    joinMeeting,
    leaveMeeting,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  };
}