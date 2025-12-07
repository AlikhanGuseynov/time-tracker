import { TimeSession } from './models/time-session';

declare global {
  interface Window {
    timeTracker?: {
      loadSessions: () => Promise<TimeSession[]>;
      saveSessions: (sessions: TimeSession[]) => Promise<void>;
      onFinishRequest?: (callback: () => void) => void;
    };
  }
}

export {};
