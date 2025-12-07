import { contextBridge, ipcRenderer } from 'electron';
import { TimeSession } from '../src/app/models/time-session';

contextBridge.exposeInMainWorld('timeTracker', {
  loadSessions: () => ipcRenderer.invoke('timeTracker:loadSessions') as Promise<TimeSession[]>,
  saveSessions: (sessions: TimeSession[]) => ipcRenderer.invoke('timeTracker:saveSessions', sessions),
  onFinishRequest: (callback: () => void) => ipcRenderer.on('timeTracker:finish', () => callback()),
});
