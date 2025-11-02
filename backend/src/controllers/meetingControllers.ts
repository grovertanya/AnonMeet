// src/controllers/meetingController.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

interface Meeting {
  id: string;
  title: string;
  hostId: string;
  participants: string[];
  createdAt: Date;
  isActive: boolean;
}

// In-memory storage (replace with database in production)
export const meetings = new Map<string, Meeting>();

export const createMeeting = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    
    const meeting: Meeting = {
      id: uuidv4(),
      title: title || 'Untitled Meeting',
      hostId: req.body.hostId || 'anonymous',
      participants: [],
      createdAt: new Date(),
      isActive: true,
    };

    meetings.set(meeting.id, meeting);

    res.status(201).json({
      success: true,
      meeting,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meeting = meetings.get(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found',
      });
    }

    res.json({
      success: true,
      meeting,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const listMeetings = async (req: Request, res: Response) => {
  try {
    const activeMeetings = Array.from(meetings.values())
      .filter(m => m.isActive);

    res.json({
      success: true,
      meetings: activeMeetings,
      count: activeMeetings.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const joinMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { participantId, name } = req.body;

    const meeting = meetings.get(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found',
      });
    }

    if (!meeting.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Meeting is not active',
      });
    }

    // Add participant if not already in meeting
    if (!meeting.participants.includes(participantId)) {
      meeting.participants.push(participantId);
    }

    res.json({
      success: true,
      meeting,
      participants: meeting.participants,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const leaveMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { participantId } = req.body;

    const meeting = meetings.get(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found',
      });
    }

    // Remove participant
    meeting.participants = meeting.participants.filter(
      p => p !== participantId
    );

    // End meeting if no participants left
    if (meeting.participants.length === 0) {
      meeting.isActive = false;
    }

    res.json({
      success: true,
      message: 'Left meeting successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!meetings.has(id)) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found',
      });
    }

    meetings.delete(id);

    res.json({
      success: true,
      message: 'Meeting deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};