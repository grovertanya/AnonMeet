// services/mediaDevices.service.ts

export interface MediaDeviceInfo {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

export interface AudioSettings {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
}

export interface VideoSettings {
  width?: number;
  height?: number;
  frameRate?: number;
  facingMode?: 'user' | 'environment';
}

class MediaDevicesService {
  async getDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.map(device => ({
        deviceId: device.deviceId,
        label: device.label || `${device.kind} ${device.deviceId.slice(0, 8)}`,
        kind: device.kind,
      }));
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
      throw new Error('Could not access media devices');
    }
  }

  async getAudioInputDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await this.getDevices();
    return devices.filter(d => d.kind === 'audioinput');
  }

  async getVideoInputDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await this.getDevices();
    return devices.filter(d => d.kind === 'videoinput');
  }

  async getAudioOutputDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await this.getDevices();
    return devices.filter(d => d.kind === 'audiooutput');
  }

  async testAudioInput(deviceId?: string): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        video: false,
      };
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      console.error('Failed to test audio input:', error);
      throw new Error('Could not access microphone');
    }
  }

  async testVideoInput(deviceId?: string): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: false,
      };
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      console.error('Failed to test video input:', error);
      throw new Error('Could not access camera');
    }
  }

  createAudioConstraints(
    deviceId?: string,
    settings?: AudioSettings
  ): MediaTrackConstraints {
    return {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      echoCancellation: settings?.echoCancellation ?? true,
      noiseSuppression: settings?.noiseSuppression ?? true,
      autoGainControl: settings?.autoGainControl ?? true,
    };
  }

  createVideoConstraints(
    deviceId?: string,
    settings?: VideoSettings
  ): MediaTrackConstraints {
    return {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      width: settings?.width ? { ideal: settings.width } : { ideal: 1280 },
      height: settings?.height ? { ideal: settings.height } : { ideal: 720 },
      frameRate: settings?.frameRate ? { ideal: settings.frameRate } : { ideal: 30 },
      facingMode: settings?.facingMode || 'user',
    };
  }

  async getAudioLevel(stream: MediaStream): Promise<number> {
    return new Promise((resolve) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const checkAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalized = average / 255;
        
        audioContext.close();
        resolve(normalized);
      };
      
      setTimeout(checkAudioLevel, 100);
    });
  }

  async checkPermissions(): Promise<{
    camera: PermissionState;
    microphone: PermissionState;
  }> {
    try {
      const cameraPermission = await navigator.permissions.query({ 
        name: 'camera' as PermissionName 
      });
      const microphonePermission = await navigator.permissions.query({ 
        name: 'microphone' as PermissionName 
      });
      
      return {
        camera: cameraPermission.state,
        microphone: microphonePermission.state,
      };
    } catch (error) {
      console.error('Failed to check permissions:', error);
      return {
        camera: 'prompt',
        microphone: 'prompt',
      };
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      // Stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Permission denied:', error);
      return false;
    }
  }

  supportsScreenCapture(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  }

  async setAudioOutputDevice(
    element: HTMLMediaElement,
    deviceId: string
  ): Promise<void> {
    try {
      if ('setSinkId' in element) {
        await (element as any).setSinkId(deviceId);
      } else {
        console.warn('Audio output device selection not supported');
      }
    } catch (error) {
      console.error('Failed to set audio output device:', error);
      throw new Error('Could not set audio output device');
    }
  }

  stopStream(stream: MediaStream | null) {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  // Monitor device changes
  onDeviceChange(callback: () => void) {
    navigator.mediaDevices.addEventListener('devicechange', callback);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', callback);
    };
  }
}

export const mediaDevicesService = new MediaDevicesService();