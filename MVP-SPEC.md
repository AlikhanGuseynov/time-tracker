# Time Tracker — MVP1 (Electron + Angular)

## 1. Project Setup
- [x] Initialize Angular project
- [x] Add Electron (main, preload, build config)
- [x] Add Electron launch script
- [x] Ensure Angular loads inside Electron window
- [x] Add simple app icon

## 2. Project Structure
- [x] Create folder `/electron`
- [x] Add `/electron/main.ts`
- [x] Add `/electron/preload.ts`
- [x] Add `/src/app/models/time-session.ts`
- [x] Add `/src/app/services/time-tracker.service.ts`
- [x] Add `/src/app/components/main/`
- [x] Add `/src/app/components/stats/`

## 3. Electron Window
- [x] Create BrowserWindow
- [x] Load Angular build
- [x] Attach preload script

## 4. Window Close Behaviour (Tray Mode)
- [x] Override window `close` event
- [x] Prevent full exit
- [x] Use `window.hide()` instead
- [x] Keep app running in background

## 5. System Tray
- [x] Create tray icon
- [x] Add tray menu:
  - [x] “Open” — show window
  - [x] “Exit” — quit app

## 6. Graceful Exit
- [x] On “Exit” menu click — send IPC to Angular: “finish active session”
- [x] Save all data
- [x] Fully quit Electron

## 7. Preload API
- [x] Expose safe API:
  - [x] `loadSessions()`
  - [x] `saveSessions(sessions)`

## 8. IPC (Main Process)
- [x] Implement channel `timeTracker:loadSessions`
- [x] Implement channel `timeTracker:saveSessions`
- [x] Store data in JSON file:
  - [x] Path: `app.getPath('userData')`
  - [x] File: `time-tracker-data.json`

## 9. Time Tracker Service (Angular)
- [x] Store list of sessions in memory
- [x] `startCategory(category)`
- [x] `pause()`
- [x] `getSessions()`
- [x] Detect and continue unfinished session on app load
- [x] After every change — call saveSessions

## 10. Main Screen (Angular)
- [x] Show fixed category tabs:
  - [x] agile_meetings
  - [x] development
  - [x] documentation
  - [x] lead_meetings
  - [x] clarification_meetings
- [x] Highlight active tab
- [x] Start/stop category via service
- [x] Timer (HH:MM:SS) updating every second
- [x] Pause button
- [x] Daily summary block at bottom

## 11. Statistics Screen (Angular)
- [x] Add StatsComponent
- [x] Filters:
  - [x] Today
  - [x] Yesterday
  - [x] This week
  - [x] This month
- [x] Sum durations per category
- [x] Output:
  - [x] Category name
  - [x] Total time (HH:MM)
- [x] Summary: “Total for period: Xh Ym”

