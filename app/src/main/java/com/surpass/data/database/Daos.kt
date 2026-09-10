package com.surpass.data.database

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface SessionDao {
    @Insert
    suspend fun insert(session: SessionEntity): Long

    @Query("SELECT * FROM sessions ORDER BY startedAt DESC")
    fun all(): Flow<List<SessionEntity>>
}

@Dao
interface BlockedAppDao {
    @Query("SELECT * FROM blocked_apps ORDER BY appName COLLATE NOCASE ASC")
    fun all(): Flow<List<BlockedAppEntity>>

    @Query("SELECT packageName FROM blocked_apps")
    suspend fun allPackages(): List<String>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(app: BlockedAppEntity)

    @Query("DELETE FROM blocked_apps WHERE packageName = :packageName")
    suspend fun delete(packageName: String)
}

@Dao
interface ScheduleDao {
    @Query("SELECT * FROM schedules ORDER BY hour, minute")
    fun all(): Flow<List<ScheduleEntity>>

    @Query("SELECT * FROM schedules WHERE id = :id")
    suspend fun byId(id: Long): ScheduleEntity?

    @Query("SELECT * FROM schedules")
    suspend fun allList(): List<ScheduleEntity>

    @Insert
    suspend fun insert(schedule: ScheduleEntity): Long

    @Query("DELETE FROM schedules WHERE id = :id")
    suspend fun delete(id: Long)
}
