package com.surpass

import android.app.Application
import android.content.Context
import com.surpass.data.database.AppDatabase
import com.surpass.data.repository.BlockedAppRepository
import com.surpass.data.repository.ScheduleRepository
import com.surpass.data.repository.SessionRepository

/**
 * Hand-rolled dependency wiring (no Hilt on purpose, to keep the build simple).
 * Everything is reachable through [AppContainer] after onCreate.
 */
class SurpassApp : Application() {
    override fun onCreate() {
        super.onCreate()
        AppContainer.init(this)
    }
}

object AppContainer {
    lateinit var db: AppDatabase
        private set
    lateinit var sessionRepo: SessionRepository
        private set
    lateinit var blockedAppRepo: BlockedAppRepository
        private set
    lateinit var scheduleRepo: ScheduleRepository
        private set

    fun init(context: Context) {
        db = AppDatabase.get(context)
        sessionRepo = SessionRepository(db.sessionDao())
        blockedAppRepo = BlockedAppRepository(db.blockedAppDao())
        scheduleRepo = ScheduleRepository(db.scheduleDao())
    }
}
