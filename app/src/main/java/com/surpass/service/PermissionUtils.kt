package com.surpass.service

import android.content.ComponentName
import android.content.Context
import android.provider.Settings
import androidx.core.app.AlarmManagerCompat

object PermissionUtils {

    fun isAccessibilityServiceEnabled(context: Context): Boolean {
        val expected = ComponentName(context, AppBlockerAccessibilityService::class.java)
            .flattenToString()
        val enabled = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: return false
        return enabled.split(':').any { it.equals(expected, ignoreCase = true) }
    }

    fun canScheduleExactAlarms(context: Context): Boolean =
        AlarmManagerCompat.canScheduleExactAlarms(context)
}
