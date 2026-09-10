package com.surpass.service

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

/**
 * Detects when a blocked app comes to the foreground and immediately covers it
 * with [BlockOverlayActivity]. This is the same mechanism Block / One Sec use —
 * Android offers no way to silently prevent another app from launching.
 */
class AppBlockerAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return
        if (!SessionState.isActive) return

        val pkg = event.packageName?.toString() ?: return
        if (pkg == packageName) return // our own UI / overlay

        if (SessionState.blockedPackages.value.contains(pkg)) {
            val intent = Intent(this, BlockOverlayActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(intent)
        }
    }

    override fun onInterrupt() = Unit
}
