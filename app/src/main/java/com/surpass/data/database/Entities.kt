package com.surpass.data.database

import androidx.room.Entity
import androidx.room.PrimaryKey

/** One study/focus session, completed or ended early. */
@Entity(tableName = "sessions")
data class SessionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val label: String,
    val startedAt: Long,       // epoch millis
    val endedAt: Long,         // epoch millis
    val plannedMinutes: Int,
    val completed: Boolean
)

/** An app the user has marked as distracting. */
@Entity(tableName = "blocked_apps")
data class BlockedAppEntity(
    @PrimaryKey val packageName: String,
    val appName: String
)

/**
 * A recurring auto-start for a focus session.
 * [daysBitmask]: bit (Calendar.DAY_OF_WEEK - 1), i.e. bit 0 = Sunday ... bit 6 = Saturday.
 */
@Entity(tableName = "schedules")
data class ScheduleEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val label: String,
    val hour: Int,
    val minute: Int,
    val durationMinutes: Int,
    val daysBitmask: Int
)
