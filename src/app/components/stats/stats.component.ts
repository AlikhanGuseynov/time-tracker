import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeSession } from '../../models/time-session';
import { TimeTrackerService } from '../../services/time-tracker.service';

type FilterKey = 'today' | 'yesterday' | 'week' | 'month';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit, OnDestroy {
  sessions: TimeSession[] = [];
  filter: FilterKey = 'today';
  sub?: Subscription;

  constructor(private service: TimeTrackerService) {}

  ngOnInit(): void {
    this.sub = this.service.getSessionsStream().subscribe((sessions) => {
      this.sessions = sessions;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  setFilter(filter: FilterKey) {
    this.filter = filter;
  }

  private getRange() {
    const now = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    if (this.filter === 'yesterday') {
      start.setDate(start.getDate() - 1);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    if (this.filter === 'week') {
      const day = start.getDay();
      const diff = (day === 0 ? 6 : day - 1);
      start.setDate(start.getDate() - diff);
    }

    if (this.filter === 'month') {
      start.setDate(1);
    }

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  getFilteredSummary() {
    const { start, end } = this.getRange();
    const totals: Record<string, number> = {};

    for (const session of this.sessions) {
      const sessionStart = new Date(session.start);
      const sessionEnd = session.end ? new Date(session.end) : new Date();
      if (sessionEnd < start || sessionStart > end) {
        continue;
      }
      const effectiveStart = sessionStart < start ? start : sessionStart;
      const effectiveEnd = sessionEnd > end ? end : sessionEnd;
      const duration = Math.max(0, effectiveEnd.getTime() - effectiveStart.getTime());
      totals[session.category] = (totals[session.category] || 0) + duration;
    }

    return totals;
  }

  getTotalDuration() {
    const summary = this.getFilteredSummary();
    return Object.values(summary).reduce((sum, val) => sum + val, 0);
  }

  formatDuration(ms: number) {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
}
