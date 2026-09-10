package com.surpass.data.repository

import com.surpass.data.database.SessionDao
import com.surpass.data.database.SessionEntity
import kotlinx.coroutines.flow.Flow

class SessionRepository(private val dao: SessionDao) {
    fun all(): Flow<List<SessionEntity>> = dao.all()

    suspend fun record(session: SessionEntity): Long = dao.insert(session)
}
