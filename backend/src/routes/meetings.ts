// src/routes/meetings.ts
import { Router } from 'express';
import {
  createMeeting,
  getMeeting,
  listMeetings,
  joinMeeting,
  leaveMeeting,
  deleteMeeting,
} from '../controllers/meetingControllers';

const router = Router();

// Create a new meeting
router.post('/', createMeeting);

// Get meeting details
router.get('/:id', getMeeting);

// List all active meetings
router.get('/', listMeetings);

// Join a meeting
router.post('/:id/join', joinMeeting);

// Leave a meeting
router.post('/:id/leave', leaveMeeting);

// Delete a meeting
router.delete('/:id', deleteMeeting);

export default router;