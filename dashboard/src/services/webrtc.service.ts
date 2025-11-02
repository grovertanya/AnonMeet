// services/webrtc.service.ts
import { wsService } from './websocket.service';

export interface MediaStreamConfig {
  video: boolean | MediaTrackConstraints;
  audio: boolean | MediaTrackConstraints;
}

export interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private participants: Map<string, Participant> = new Map();
  private configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  constructor() {
    this.setupWebSocketHandlers();
  }

  

  private setupWebSocketHandlers() {
    wsService.on('participant-joined', (data) => this.handleParticipantJoined(data));
    wsService.on('participant-left', (data) => this.handleParticipantLeft(data));
    wsService.on('offer', (data) => this.handleOffer(data));
    wsService.on('answer', (data) => this.handleAnswer(data));
    wsService.on('ice-candidate', (data) => this.handleIceCandidate(data));
    wsService.on('audio-toggle', (data) => this.handleAudioToggle(data));
    wsService.on('video-toggle', (data) => this.handleVideoToggle(data));
  }

  async initializeLocalStream(config: MediaStreamConfig = { video: true, audio: true }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(config);
      return this.localStream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      throw new Error('Could not access camera/microphone');
    }
  }

//   async startScreenShare(): Promise<MediaStream> {
//     try {
//       this.screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: { cursor: 'always' },
//         audio: false,
//       });

//       // Handle screen share stop
//       this.screenStream.getVideoTracks()[0].onended = () => {
//         this.stopScreenShare();
//       };

//       // Replace video track in all peer connections
//       this.replaceVideoTrack(this.screenStream.getVideoTracks()[0]);

//       wsService.send('screen-share', { started: true });
//       return this.screenStream;
//     } catch (error) {
//       console.error('Failed to start screen share:', error);
//       throw new Error('Could not start screen sharing');
//     }
//   }

//   stopScreenShare() {
//     if (this.screenStream) {
//       this.screenStream.getTracks().forEach(track => track.stop());
//       this.screenStream = null;

//       // Restore camera video track
//       if (this.localStream) {
//         const videoTrack = this.localStream.getVideoTracks()[0];
//         if (videoTrack) {
//           this.replaceVideoTrack(videoTrack);
//         }
//       }

//       wsService.send('screen-share', { started: false });
//     }
//   }

  private replaceVideoTrack(newTrack: MediaStreamTrack) {
    this.peerConnections.forEach((pc) => {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (sender) {
        sender.replaceTrack(newTrack);
      }
    });
  }

  private async handleParticipantJoined(data: any) {
    const { participantId, name } = data;
    
    this.participants.set(participantId, {
      id: participantId,
      name,
      isAudioEnabled: true,
      isVideoEnabled: true,
    });

    // Create peer connection for new participant
    await this.createPeerConnection(participantId);
    
    // Create and send offer
    const offer = await this.createOffer(participantId);
    wsService.send('offer', {
      targetId: participantId,
      offer,
    });
  }

  private handleParticipantLeft(data: any) {
    const { participantId } = data;
    
    const pc = this.peerConnections.get(participantId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(participantId);
    }
    
    this.participants.delete(participantId);
  }

  private async handleOffer(data: any) {
    const { senderId, offer } = data;
    
    const pc = await this.createPeerConnection(senderId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    wsService.send('answer', {
      targetId: senderId,
      answer,
    });
  }

  private async handleAnswer(data: any) {
    const { senderId, answer } = data;
    
    const pc = this.peerConnections.get(senderId);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  private async handleIceCandidate(data: any) {
    const { senderId, candidate } = data;
    
    const pc = this.peerConnections.get(senderId);
    if (pc && candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private handleAudioToggle(data: any) {
    const { participantId, enabled } = data;
    const participant = this.participants.get(participantId);
    if (participant) {
      participant.isAudioEnabled = enabled;
    }
  }

  private handleVideoToggle(data: any) {
    const { participantId, enabled } = data;
    const participant = this.participants.get(participantId);
    if (participant) {
      participant.isVideoEnabled = enabled;
    }
  }

  private async createPeerConnection(participantId: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection(this.configuration);
    
    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle incoming stream
    pc.ontrack = (event) => {
      const participant = this.participants.get(participantId);
      if (participant) {
        participant.stream = event.streams[0];
        // Trigger callback for UI update
        this.onRemoteStream?.(participantId, event.streams[0]);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        wsService.send('ice-candidate', {
          targetId: participantId,
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state for ${participantId}:`, pc.connectionState);
      
      if (pc.connectionState === 'failed') {
        this.restartIce(participantId);
      }
    };

    this.peerConnections.set(participantId, pc);
    return pc;
  }

  private async createOffer(participantId: string): Promise<RTCSessionDescriptionInit> {
    const pc = this.peerConnections.get(participantId);
    if (!pc) throw new Error('Peer connection not found');

    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    
    await pc.setLocalDescription(offer);
    return offer;
  }

  private async restartIce(participantId: string) {
    const pc = this.peerConnections.get(participantId);
    if (pc) {
      pc.restartIce();
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
      wsService.send('audio-toggle', { enabled });
    }
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
      wsService.send('video-toggle', { enabled });
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getParticipants(): Map<string, Participant> {
    return this.participants;
  }

  getParticipantStream(participantId: string): MediaStream | undefined {
    return this.participants.get(participantId)?.stream;
  }

  // Callback for when remote stream is received
  onRemoteStream?: (participantId: string, stream: MediaStream) => void;

  cleanup() {
    // Stop local streams
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }

    // Close all peer connections
    this.peerConnections.forEach(pc => pc.close());
    this.peerConnections.clear();
    this.participants.clear();
  }
}

export const webrtcService = new WebRTCService();