// src/websocket.ts
import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { URL } from 'url';

interface Client {
  ws: WebSocket;
  meetingId: string;
  participantId: string;
  name: string;
}

const clients = new Map<string, Client>();
const meetings = new Map<string, Set<string>>();

export function setupWebSocket(server: HTTPServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/');
    const meetingId = pathParts[pathParts.indexOf('meetings') + 1];

    if (!meetingId) {
      ws.close(1008, 'Meeting ID required');
      return;
    }

    const participantId = generateId();
    const name = url.searchParams.get('name') || `User ${participantId.slice(0, 6)}`;

    // Store client
    const client: Client = { ws, meetingId, participantId, name };
    clients.set(participantId, client);

    // Add to meeting
    if (!meetings.has(meetingId)) {
      meetings.set(meetingId, new Set());
    }
    meetings.get(meetingId)!.add(participantId);

    console.log(`✅ ${name} joined meeting ${meetingId}`);

    // Notify others about new participant
    broadcastToMeeting(meetingId, {
      type: 'participant-joined',
      data: { participantId, name },
    }, participantId);

    // Send current participants to new user
    const currentParticipants = Array.from(meetings.get(meetingId)!)
      .filter(id => id !== participantId)
      .map(id => {
        const c = clients.get(id);
        return { id, name: c?.name };
      });

    ws.send(JSON.stringify({
      type: 'participants-list',
      data: { participants: currentParticipants },
    }));

    // Handle messages
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        handleMessage(participantId, data);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    // Handle disconnect
    ws.on('close', () => {
      console.log(`❌ ${name} left meeting ${meetingId}`);
      
      clients.delete(participantId);
      meetings.get(meetingId)?.delete(participantId);

      // Clean up empty meetings
      if (meetings.get(meetingId)?.size === 0) {
        meetings.delete(meetingId);
      }

      // Notify others
      broadcastToMeeting(meetingId, {
        type: 'participant-left',
        data: { participantId },
      });
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('✅ WebSocket server initialized');
}

function handleMessage(senderId: string, message: any) {
  const client = clients.get(senderId);
  if (!client) return;

  const { type, data } = message;

  switch (type) {
    case 'offer':
    case 'answer':
    case 'ice-candidate':
      // Forward signaling messages to target peer
      if (data.targetId) {
        sendToClient(data.targetId, {
          type,
          data: { ...data, senderId },
        });
      }
      break;

    case 'audio-toggle':
    case 'video-toggle':
      // Broadcast media state changes
      broadcastToMeeting(client.meetingId, {
        type,
        data: { participantId: senderId, enabled: data.enabled },
      }, senderId);
      break;

    case 'screen-share':
      // Broadcast screen share status
      broadcastToMeeting(client.meetingId, {
        type,
        data: { participantId: senderId, started: data.started },
      }, senderId);
      break;

    case 'message':
      // Broadcast chat messages
      broadcastToMeeting(client.meetingId, {
        type: 'message',
        data: {
          participantId: senderId,
          name: client.name,
          message: data.message,
          timestamp: new Date().toISOString(),
        },
      });
      break;

    case 'heartbeat':
      // Respond to heartbeat
      client.ws.send(JSON.stringify({ type: 'heartbeat-ack' }));
      break;

    default:
      console.log('Unknown message type:', type);
  }
}

function sendToClient(clientId: string, message: any) {
  const client = clients.get(clientId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message));
  }
}

function broadcastToMeeting(meetingId: string, message: any, excludeId?: string) {
  const participantIds = meetings.get(meetingId);
  if (!participantIds) return;

  participantIds.forEach(id => {
    if (id !== excludeId) {
      sendToClient(id, message);
    }
  });
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}