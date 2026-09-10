package com.surpass.data.repository

import com.surpass.data.database.BlockedAppDao
import com.surpass.data.database.BlockedAppEntity
import kotlinx.coroutines.flow.Flow

class BlockedAppRepository(private val dao: BlockedAppDao) {
    fun all(): Flow<List<BlockedAppEntity>> = dao.all()

    /** Snapshot of the current block list (used when a session starts). */
    suspend fun packages(): List<String> = dao.allPackages()

    suspend fun add(packageName: String, appName: String) =
        dao.insert(BlockedAppEntity(packageName, appName))

    suspend fun remove(packageName: String) = dao.delete(packageName)
}
