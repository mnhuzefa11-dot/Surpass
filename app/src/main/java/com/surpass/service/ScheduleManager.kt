package com.surpass.service

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.surpass.data.database.ScheduleEntity
import java.util.Calendar

/** Wraps AlarmManager for recurring focus-session schedules. */
object ScheduleManager {

    const val EXTRA_SCHEDULE_ID = "extra_schedule_id"

    fun pendingIntent(context: Context, schedule: ScheduleEntity): PendingIntent {
        val intent = Intent(context, ScheduleAlarmReceiver::class.java)
            .putExtra(EXTRA_SCHEDULE_ID, schedule.id)
        return PendingIntent.getBroadcast(
            context,
            schedule.id.toInt(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    /** Arms the exact alarm for the next enabled day-of-week occurrence. */
    fun scheduleNext(context: Context, schedule: ScheduleEntity) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val now = System.currentTimeMillis()
        val base = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, schedule.hour)
            set(Calendar.MINUTE, schedule.minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        for (offset in 0..7) {
            val candidate = base.clone() as Calendar
            candidate.add(Calendar.DAY_OF_YEAR, offset)
            val dayOfWeek = candidate.get(Calendar.DAY_OF_WEEK) // 1 = Sunday
            val enabled = schedule.daysBitmask and (1 shl (dayOfWeek - 1)) != 0
            if (enabled && candidate.timeInMillis > now) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    candidate.timeInMillis,
                    pendingIntent(context, schedule)
                )
                return
            }
        }
    }

    fun cancel(context: Context, schedule: ScheduleEntity) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.cancel(pendingIntent(context, schedule))
    }
}
