package com.surpass.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import com.surpass.AppContainer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Fired by the exact alarm for a schedule: starts the session and re-arms the
 * next occurrence.
 */
class ScheduleAlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val id = intent.getLongExtra(ScheduleManager.EXTRA_SCHEDULE_ID, -1L)
        if (id < 0) return

        val pending = goAsync()
        CoroutineScope(Dispatchers.Default).launch {
            try {
                val schedule = AppContainer.scheduleRepo.byId(id)
                if (schedule != null) {
                    val service = Intent(context, TimerService::class.java)
                        .setAction(TimerService.ACTION_START)
                        .putExtra(TimerService.EXTRA_LABEL, schedule.label)
                        .putExtra(TimerService.EXTRA_MINUTES, schedule.durationMinutes)
                    ContextCompat.startForegroundService(context, service)
                    ScheduleManager.scheduleNext(context, schedule)
                }
            } finally {
                pending.finish()
            }
        }
    }
}
