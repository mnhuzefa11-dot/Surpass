package com.surpass.data.repository

import com.surpass.data.database.ScheduleDao
import com.surpass.data.database.ScheduleEntity
import kotlinx.coroutines.flow.Flow

class ScheduleRepository(private val dao: ScheduleDao) {
    fun all(): Flow<List<ScheduleEntity>> = dao.all()

    suspend fun byId(id: Long): ScheduleEntity? = dao.byId(id)

    suspend fun allList(): List<ScheduleEntity> = dao.allList()

    suspend fun add(schedule: ScheduleEntity): Long = dao.insert(schedule)

    suspend fun remove(id: Long) = dao.delete(id)
}
