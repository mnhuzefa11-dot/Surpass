package com.surpass.service

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

/**
 * Shared in-memory state for the currently running focus session.
 * Survives across activities and the accessibility service while the
 * process lives; the Room history is the durable record.
 */
object SessionState {

    data class Active(
        val label: String,
        val startedAt: Long,
        val endsAt: Long,
        val plannedMinutes: Int
    )

    private val _active = MutableStateFlow<Active?>(null)
    val active: StateFlow<Active?> get() = _active

    private val _blockedPackages = MutableStateFlow<Set<String>>(emptySet())
    val blockedPackages: StateFlow<Set<String>> get() = _blockedPackages

    val isActive: Boolean get() = _active.value != null

    fun remainingMillis(): Long =
        _active.value?.let { it.endsAt - System.currentTimeMillis() } ?: 0L

    fun start(label: String, durationMinutes: Int, blockedPackages: Set<String>) {
        val now = System.currentTimeMillis()
        _blockedPackages.value = blockedPackages
        _active.value = Active(
            label = label,
            startedAt = now,
            endsAt = now + durationMinutes * 60_000L,
            plannedMinutes = durationMinutes
        )
    }

    fun stop() {
        _active.value = null
        _blockedPackages.value = emptySet()
    }
}
