# Surpass

A study-focus app inspired by **Block – App & Site Blocker** (the green one on the
Play Store): run a timer for a study session, and Surpass aggressively locks you
out of whichever apps you've marked as distracting until the session ends.

## Features

- **Timer**: pick a preset duration (25/50/90 min) or enter a custom number of
  minutes, start a session, watch the countdown. Runs as a foreground service so
  it survives screen-off and backgrounding.
- **Aggressive app blocking**: pick any installed app to block. While a session
  is active, opening a blocked app immediately shows a full-screen "focus
  shield" overlay with no exit button and no back navigation — it only
  disappears when the session ends. Uses Android's Accessibility Service API,
  the same mechanism Block / One Sec use, since Android does not let apps
  silently block other apps.
- **Recurring schedules**: set a study block to auto-start at a specific time on
  chosen days of the week (e.g. "Anatomy, 8:00 AM, Mon/Wed/Fri, 50 min"). Uses
  exact alarms so it fires at the precise minute, and re-arms itself after each
  firing and after a device reboot.
- **Analytics**: current streak (consecutive days studied), all-time hours,
  total completed sessions, and a 7-day bar chart — all computed from local
  session history, no chart library needed.
- **Local history**: every session (completed or ended early) is saved to a
  local Room database.
- **Green, Block-style theme** with an adaptive launcher icon (green background,
  white "no entry" glyph).

Not yet built: per-schedule blocked-app lists (schedules use the same global
block list you set on the Blocked Apps screen), a way to edit an existing
schedule (currently delete + re-add), and website blocking.

## Building the APK (no PC required)

This project has **no local Gradle wrapper checked in on purpose** — the GitHub
Actions workflow installs Gradle itself in the cloud, so you never need Android
Studio or a wrapper jar to get an APK.

1. Push this repo to GitHub (any branch matching `main` or `arena/**` triggers
   the workflow; you can also trigger it manually with "Run workflow").
2. Go to your repo on GitHub → the **Actions** tab → open the
   **"Build Surpass APK"** run.
3. When it finishes (green check), open the run → scroll to **Artifacts** →
   download `surpass-debug-apk`. Unzip it on your phone to get `app-debug.apk`,
   then install it (you'll need to allow "install unknown apps" for whichever
   app you download it with).

## After installing: enabling the block

Android requires you to manually turn on the Accessibility Service — no app can
self-grant this. The app will prompt you: **Blocked apps screen → "Open
Accessibility settings"** → find **Surpass** → toggle it on. Without this step,
apps will be *added* to your block list but won't actually be blocked.

Similarly, if you set up a recurring schedule, Android 12+ requires you to grant
the **exact alarm** permission for it to fire at the precise time you set. The
Schedules screen shows a "Grant permission" button when this is missing.

## Project structure

```
app/src/main/java/com/surpass/
├── MainActivity.kt              # Screen-state navigation (Home/Timer/BlockedApps/Schedule/Analytics)
├── SurpassApp.kt                # Application class + AppContainer (hand-wired dependencies)
├── data/
│   ├── database/                # Room entities, DAOs, database
│   └── repository/              # Session, BlockedApp, and Schedule repositories
├── service/
│   ├── SessionState.kt          # Shared in-memory state (session active? which apps blocked?)
│   ├── TimerService.kt          # Foreground service running the countdown
│   ├── AppBlockerAccessibilityService.kt  # Detects blocked-app launches
│   ├── BlockOverlayActivity.kt  # Full-screen lock shown over a blocked app
│   ├── ScheduleManager.kt       # AlarmManager wrapper for recurring schedules
│   ├── ScheduleAlarmReceiver.kt # Fires a scheduled session, reschedules the next one
│   ├── BootReceiver.kt          # Re-arms schedules after device reboot
│   └── PermissionUtils.kt       # Checks accessibility + exact-alarm permissions
├── viewmodel/                   # BlockedAppsViewModel, ScheduleViewModel, AnalyticsViewModel
└── ui/
    ├── screens/                 # Home, Timer, BlockedApps, Schedule, Analytics
    └── theme/                   # Compose Material3 green theme
```

No Hilt/Dagger on purpose — dependencies are wired by hand (see `AppContainer`)
to keep the build simple.
