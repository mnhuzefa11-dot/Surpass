package com.surpass.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.surpass.AppContainer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/** Re-arms every saved schedule after the device reboots. */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
        val pending = goAsync()
        CoroutineScope(Dispatchers.Default).launch {
            try {
                AppContainer.scheduleRepo.allList().forEach { schedule ->
                    ScheduleManager.scheduleNext(context, schedule)
                }
            } finally {
                pending.finish()
            }
        }
    }
}
