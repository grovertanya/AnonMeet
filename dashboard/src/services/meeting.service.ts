// services/meeting.service.ts
import { httpClient } from './httpClient';
import { wsService } from './websocket.service';
import { webrtcService, MediaStreamConfig } from './webrtc.service';
import { ENDPOINTS } from '../config/api.config';

export interface Meeting {
  id: string;
  title: string;
  hostId: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
}

export interface CreateMeetingData {
  title: string;
  scheduledTime?: Date;
  duration?: number;
}

export interface JoinMeetingResponse {
  meeting: Meeting;
  participants: Array<{
    id: string;
    name: string;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
  }>;
}

class MeetingService {
  private currentMeetingId: string | null = null;

  async createMeeting(data: CreateMeetingData): Promise<Meeting> {
    try {
      const response = await httpClient.post<Meeting>(
        ENDPOINTS.meetings.create,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create meeting');
    }
  }

  async joinMeeting(
    meetingId: string,
    mediaConfig: MediaStreamConfig = { video: true, audio: true }
  ): Promise<MediaStream> {
    try {
      this.currentMeetingId = meetingId;

      // Join meeting via API
      await httpClient.post<JoinMeetingResponse>(
        ENDPOINTS.meetings.join.replace(':id', meetingId)
      );

      // Initialize local media stream
      const localStream = await webrtcService.initializeLocalStream(mediaConfig);

      // Connect to WebSocket
      await wsService.connect(meetingId);

      return localStream;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to join meeting');
    }
  }

  async leaveMeeting(): Promise<void> {
    if (!this.currentMeetingId) return;

    try {
      await httpClient.post(
        ENDPOINTS.meetings.leave.replace(':id', this.currentMeetingId)
      );
    } catch (error) {
      console.error('Error leaving meeting:', error);
    } finally {
      // Cleanup connections
      webrtcService.cleanup();
      wsService.disconnect();
      this.currentMeetingId = null;
    }
  }

  async getMeeting(meetingId: string): Promise<Meeting> {
    try {
      const response = await httpClient.get<Meeting>(
        ENDPOINTS.meetings.get.replace(':id', meetingId)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get meeting');
    }
  }

  async listMeetings(): Promise<Meeting[]> {
    try {
      const response = await httpClient.get<Meeting[]>(ENDPOINTS.meetings.list);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to list meetings');
    }
  }

  async updateMeeting(meetingId: string, data: Partial<Meeting>): Promise<Meeting> {
    try {
      const response = await httpClient.patch<Meeting>(
        ENDPOINTS.meetings.update.replace(':id', meetingId),
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update meeting');
    }
  }

  async deleteMeeting(meetingId: string): Promise<void> {
    try {
      await httpClient.delete(
        ENDPOINTS.meetings.delete.replace(':id', meetingId)
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete meeting');
    }
  }

  // Media controls
  toggleAudio(enabled: boolean) {
    webrtcService.toggleAudio(enabled);
  }

  toggleVideo(enabled: boolean) {
    webrtcService.toggleVideo(enabled);
  }

  async startScreenShare(): Promise<MediaStream> {
    return webrtcService.startScreenShare();
  }

  stopScreenShare() {
    webrtcService.stopScreenShare();
  }

  // Get current meeting state
  getCurrentMeetingId(): string | null {
    return this.currentMeetingId;
  }

  getLocalStream(): MediaStream | null {
    return webrtcService.getLocalStream();
  }

  getParticipants() {
    return webrtcService.getParticipants();
  }

  getParticipantStream(participantId: string): MediaStream | undefined {
    return webrtcService.getParticipantStream(participantId);
  }

  // Set callback for remote streams
  onRemoteStream(callback: (participantId: string, stream: MediaStream) => void) {
    webrtcService.onRemoteStream = callback;
  }

  // WebSocket event listeners
  onParticipantJoined(callback: (data: any) => void) {
    wsService.on('participant-joined', callback);
  }

  onParticipantLeft(callback: (data: any) => void) {
    wsService.on('participant-left', callback);
  }

  onMessage(callback: (data: any) => void) {
    wsService.on('message', callback);
  }

  onMeetingEnded(callback: (data: any) => void) {
    wsService.on('meeting-ended', callback);
  }

  sendMessage(message: string) {
    wsService.send('message', { message });
  }
}

export const meetingService = new MeetingService();