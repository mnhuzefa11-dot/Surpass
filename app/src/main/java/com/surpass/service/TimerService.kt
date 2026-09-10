package com.surpass.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.surpass.AppContainer
import com.surpass.MainActivity
import com.surpass.R
import com.surpass.data.database.SessionEntity
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Foreground service running the countdown for a focus session.
 * While [SessionState.isActive], the accessibility service blocks apps.
 */
class TimerService : Service() {

    companion object {
        const val ACTION_START = "com.surpass.action.START"
        const val ACTION_STOP = "com.surpass.action.STOP"
        const val EXTRA_LABEL = "extra_label"
        const val EXTRA_MINUTES = "extra_minutes"
        const val CHANNEL_ID = "surpass_session"
        const val NOTIFICATION_ID = 1
    }

    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var ticker: Job? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                val label = intent.getStringExtra(EXTRA_LABEL) ?: "Focus session"
                val minutes = intent.getIntExtra(EXTRA_MINUTES, 25)
                begin(label, minutes)
            }
            ACTION_STOP -> endSession(completed = false)
        }
        return START_NOT_STICKY
    }

    private fun begin(label: String, minutes: Int) {
        // startForeground must happen promptly on the main thread.
        startForegroundNotification("Starting $label…")

        ticker?.cancel()
        ticker = scope.launch {
            val blocked = AppContainer.blockedAppRepo.packages().toSet()
            SessionState.start(label, minutes, blocked)
            while (SessionState.isActive) {
                val remaining = SessionState.remainingMillis()
                if (remaining <= 0) {
                    endSession(completed = true)
                    break
                }
                postProgressNotification()
                delay(1000)
            }
        }
    }

    private fun endSession(completed: Boolean) {
        val active = SessionState.active.value ?: return
        SessionState.stop()
        val endedAt = if (completed) active.endsAt else System.currentTimeMillis()
        scope.launch {
            AppContainer.sessionRepo.record(
                SessionEntity(
                    label = active.label,
                    startedAt = active.startedAt,
                    endedAt = endedAt.coerceAtLeast(active.startedAt),
                    plannedMinutes = active.plannedMinutes,
                    completed = completed
                )
            )
        }
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun postProgressNotification() {
        val active = SessionState.active.value ?: return
        startForegroundNotification(
            "${active.label} · ${formatMillis(SessionState.remainingMillis())} left"
        )
    }

    private fun startForegroundNotification(text: String) {
        val notification = buildNotification(text)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    private fun buildNotification(text: String): Notification {
        val openApp = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("Surpass")
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setContentIntent(openApp)
            .build()
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(NotificationManager::class.java)
            val channel = NotificationChannel(
                CHANNEL_ID,
                getString(R.string.session_channel_name),
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = getString(R.string.session_channel_description)
            }
            nm.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        ticker?.cancel()
        scope.cancel()
        super.onDestroy()
    }

    private fun formatMillis(millis: Long): String {
        val totalSeconds = (millis.coerceAtLeast(0) + 999) / 1000
        val minutes = TimeUnit.SECONDS.toMinutes(totalSeconds)
        val seconds = totalSeconds - minutes * 60
        return if (minutes >= 60) {
            String.format("%d:%02d:%02d", minutes / 60, minutes % 60, seconds)
        } else {
            String.format("%d:%02d", minutes, seconds)
        }
    }
}
