package com.surpass.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.surpass.AppContainer
import java.util.Calendar
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

data class DayBar(val dayLabel: String, val minutes: Long)

data class AnalyticsStats(
    val currentStreak: Int,
    val totalMinutes: Long,
    val completedSessions: Int,
    val week: List<DayBar>
)

class AnalyticsViewModel : ViewModel() {

    val stats: StateFlow<AnalyticsStats> = AppContainer.sessionRepo.all()
        .map { sessions -> computeStats(sessions) }
        .stateIn(
            viewModelScope,
            SharingStarted.Eagerly,
            AnalyticsStats(0, 0, 0, emptyList())
        )

    private fun computeStats(sessions: List<com.surpass.data.database.SessionEntity>): AnalyticsStats {
        val completed = sessions.filter { it.completed }
        val totalMinutes = sessions.sumOf { s ->
            TimeUnit.MILLISECONDS.toMinutes((s.endedAt - s.startedAt).coerceAtLeast(0))
        }

        // Days (start-of-day millis) with at least one completed session.
        val activeDays = completed.map { startOfDay(it.startedAt) }.toSet()

        // Streak: consecutive days ending today (or yesterday if today not yet studied).
        var streak = 0
        var cursor = startOfDay(System.currentTimeMillis())
        if (cursor !in activeDays) cursor -= DAY_MILLIS
        while (cursor in activeDays) {
            streak++
            cursor -= DAY_MILLIS
        }

        // Last 7 days bar chart.
        val today = startOfDay(System.currentTimeMillis())
        val week = (6 downTo 0).map { back ->
            val day = today - back * DAY_MILLIS
            val minutes = sessions
                .filter { startOfDay(it.startedAt) == day }
                .sumOf { TimeUnit.MILLISECONDS.toMinutes((it.endedAt - it.startedAt).coerceAtLeast(0)) }
            DayBar(dayLetter(day), minutes)
        }

        return AnalyticsStats(streak, totalMinutes, completed.size, week)
    }

    private fun startOfDay(millis: Long): Long {
        val cal = Calendar.getInstance().apply {
            timeInMillis = millis
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        return cal.timeInMillis
    }

    private fun dayLetter(millis: Long): String {
        val cal = Calendar.getInstance().apply { timeInMillis = millis }
        return cal.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.SHORT, java.util.Locale.getDefault())
            ?.take(1) ?: ""
    }

    companion object {
        private const val DAY_MILLIS = 24L * 60 * 60 * 1000
    }
}
