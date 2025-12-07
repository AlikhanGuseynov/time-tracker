import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { TimeSession } from '../models/time-session';

@Injectable({ providedIn: 'root' })
export class TimeTrackerService {
  private sessions: TimeSession[] = [];
  private sessions$ = new BehaviorSubject<TimeSession[]>([]);
  private activeSession: TimeSession | null = null;
  private tickSub?: Subscription;

  constructor(private zone: NgZone) {
    this.initialize();
  }

  getSessionsStream() {
    return this.sessions$.asObservable();
  }

  getActiveSession() {
    return this.activeSession;
  }

  async startCategory(category: string) {
    await this.finishActive();
    const now = new Date().toISOString();
    this.activeSession = {
      id: crypto.randomUUID(),
      category,
      start: now,
    };
    this.sessions.push(this.activeSession);
    this.emitSessions();
    this.persist();
    this.ensureTicking();
  }

  async pause() {
    await this.finishActive();
  }

  getTodaySummary() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const map: Record<string, number> = {};

    for (const session of this.sessions) {
      const start = new Date(session.start);
      if (start >= startOfDay) {
        const end = session.end ? new Date(session.end) : new Date();
        const duration = Math.max(0, end.getTime() - start.getTime());
        map[session.category] = (map[session.category] || 0) + duration;
      }
    }
    return map;
  }

  getElapsedMs(): number {
    if (!this.activeSession) {
      return 0;
    }
    return Date.now() - new Date(this.activeSession.start).getTime();
  }

  private async initialize() {
    const saved = (await window.timeTracker?.loadSessions?.()) ?? [];
    this.sessions = saved;
    this.activeSession = this.findLatestUnfinished();
    this.emitSessions();
    if (this.activeSession) {
      this.ensureTicking();
    }

    window.timeTracker?.onFinishRequest?.(() => {
      this.zone.run(() => {
        this.finishActive();
      });
    });
  }

  private findLatestUnfinished() {
    for (let i = this.sessions.length - 1; i >= 0; i -= 1) {
      if (!this.sessions[i].end) {
        return this.sessions[i];
      }
    }
    return null;
  }

  private async finishActive() {
    if (!this.activeSession) return;
    if (!this.activeSession.end) {
      this.activeSession.end = new Date().toISOString();
    }
    this.activeSession = null;
    this.emitSessions();
    await this.persist();
    this.stopTicking();
  }

  private emitSessions() {
    this.sessions$.next([...this.sessions]);
  }

  private async persist() {
    await window.timeTracker?.saveSessions?.(this.sessions);
  }

  private ensureTicking() {
    if (this.tickSub) return;
    this.tickSub = interval(1000).subscribe(() => this.sessions$.next([...this.sessions]));
  }

  private stopTicking() {
    this.tickSub?.unsubscribe();
    this.tickSub = undefined;
  }
}
