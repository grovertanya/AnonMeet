// hooks/useMediaDevices.ts
import { useState, useEffect } from 'react';
import { mediaDevicesService, MediaDeviceInfo } from '../services/mediaDevices.service';

export function useMediaDevices() {
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState<string>('');
  const [selectedVideoInput, setSelectedVideoInput] = useState<string>('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState<string>('');
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    loadDevices();
    checkPermissions();

    // Listen for device changes
    const cleanup = mediaDevicesService.onDeviceChange(() => {
      loadDevices();
    });

    return cleanup;
  }, []);

  const loadDevices = async () => {
    try {
      const [audio, video, outputs] = await Promise.all([
        mediaDevicesService.getAudioInputDevices(),
        mediaDevicesService.getVideoInputDevices(),
        mediaDevicesService.getAudioOutputDevices(),
      ]);

      setAudioInputs(audio);
      setVideoInputs(video);
      setAudioOutputs(outputs);

      // Set defaults
      if (audio.length > 0 && !selectedAudioInput) {
        setSelectedAudioInput(audio[0].deviceId);
      }
      if (video.length > 0 && !selectedVideoInput) {
        setSelectedVideoInput(video[0].deviceId);
      }
      if (outputs.length > 0 && !selectedAudioOutput) {
        setSelectedAudioOutput(outputs[0].deviceId);
      }
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const checkPermissions = async () => {
    try {
      const granted = await mediaDevicesService.requestPermissions();
      setHasPermissions(granted);
    } catch (error) {
      console.error('Permission check failed:', error);
      setHasPermissions(false);
    }
  };

  const requestPermissions = async () => {
    const granted = await mediaDevicesService.requestPermissions();
    setHasPermissions(granted);
    if (granted) {
      await loadDevices();
    }
    return granted;
  };

  return {
    audioInputs,
    videoInputs,
    audioOutputs,
    selectedAudioInput,
    selectedVideoInput,
    selectedAudioOutput,
    setSelectedAudioInput,
    setSelectedVideoInput,
    setSelectedAudioOutput,
    hasPermissions,
    requestPermissions,
  };
}