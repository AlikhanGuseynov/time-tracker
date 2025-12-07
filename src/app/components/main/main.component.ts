import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { TimeTrackerService } from '../../services/time-tracker.service';
import { TimeSession } from '../../models/time-session';

const CATEGORIES = [
  'agile_meetings',
  'development',
  'documentation',
  'lead_meetings',
  'clarification_meetings',
];

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  categories = CATEGORIES;
  sessions: TimeSession[] = [];
  activeCategory: string | null = null;
  ticker?: Subscription;
  now = Date.now();

  constructor(
    private service: TimeTrackerService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.service.getSessionsStream().subscribe((sessions) => {
      this.sessions = sessions;
      const active = this.service.getActiveSession();
      this.activeCategory = active?.category ?? null;
      this.changeDetector.detectChanges();
    });
    this.ticker = interval(1000).subscribe(() => {
      this.now = Date.now();
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.ticker?.unsubscribe();
  }

  async start(category: string) {
    await this.service.startCategory(category);
  }

  async pause() {
    await this.service.pause();
    this.activeCategory = null;
  }

  isActive(category: string) {
    return this.activeCategory === category;
  }

  formatTimer(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  getTimer() {
    return this.service.getElapsedMs();
  }

  getTodaySummary() {
    return this.service.getTodaySummary();
  }
}
