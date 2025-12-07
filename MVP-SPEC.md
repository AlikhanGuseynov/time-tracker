# Time Tracker — MVP1 (Electron + Angular)

## 1. Project Setup
- [ ] Initialize Angular project  
- [ ] Add Electron (main, preload, build config)  
- [ ] Add Electron launch script  
- [ ] Ensure Angular loads inside Electron window  
- [ ] Add simple app icon  

## 2. Project Structure
- [ ] Create folder `/electron`  
- [ ] Add `/electron/main.ts`  
- [ ] Add `/electron/preload.ts`  
- [ ] Add `/src/app/models/time-session.ts`  
- [ ] Add `/src/app/services/time-tracker.service.ts`  
- [ ] Add `/src/app/components/main/`  
- [ ] Add `/src/app/components/stats/`  

## 3. Electron Window
- [ ] Create BrowserWindow  
- [ ] Load Angular build  
- [ ] Attach preload script  

## 4. Window Close Behaviour (Tray Mode)
- [ ] Override window `close` event  
- [ ] Prevent full exit  
- [ ] Use `window.hide()` instead  
- [ ] Keep app running in background  

## 5. System Tray
- [ ] Create tray icon  
- [ ] Add tray menu:  
  - [ ] “Open” — show window  
  - [ ] “Exit” — quit app  

## 6. Graceful Exit
- [ ] On “Exit” menu click — send IPC to Angular: “finish active session”  
- [ ] Save all data  
- [ ] Fully quit Electron  

## 7. Preload API
- [ ] Expose safe API:
  - [ ] `loadSessions()`  
  - [ ] `saveSessions(sessions)`  

## 8. IPC (Main Process)
- [ ] Implement channel `timeTracker:loadSessions`  
- [ ] Implement channel `timeTracker:saveSessions`  
- [ ] Store data in JSON file:
  - [ ] Path: `app.getPath('userData')`  
  - [ ] File: `time-tracker-data.json`  

## 9. Time Tracker Service (Angular)
- [ ] Store list of sessions in memory  
- [ ] `startCategory(category)`  
- [ ] `pause()`  
- [ ] `getSessions()`  
- [ ] Detect and continue unfinished session on app load  
- [ ] After every change — call saveSessions  

## 10. Main Screen (Angular)
- [ ] Show fixed category tabs:
  - [ ] agile_meetings  
  - [ ] development  
  - [ ] documentation  
  - [ ] lead_meetings  
  - [ ] clarification_meetings  
- [ ] Highlight active tab  
- [ ] Start/stop category via service  
- [ ] Timer (HH:MM:SS) updating every second  
- [ ] Pause button  
- [ ] Daily summary block at bottom  

## 11. Statistics Screen (Angular)
- [ ] Add StatsComponent  
- [ ] Filters:
  - [ ] Today  
  - [ ] Yesterday  
  - [ ] This week  
  - [ ] This month  
- [ ] Sum durations per category  
- [ ] Output:
  - [ ] Category name  
  - [ ] Total time (HH:MM)  
- [ ] Summary: “Total for period: Xh Ym”  

