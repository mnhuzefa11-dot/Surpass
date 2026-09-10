package com.surpass.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.surpass.AppContainer
import com.surpass.data.database.ScheduleEntity
import com.surpass.service.ScheduleManager
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ScheduleViewModel : ViewModel() {

    private val repo = AppContainer.scheduleRepo

    val schedules: StateFlow<List<ScheduleEntity>> = repo.all()
        .stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())

    fun add(
        context: Context,
        label: String,
        hour: Int,
        minute: Int,
        durationMinutes: Int,
        daysBitmask: Int
    ) {
        viewModelScope.launch {
            val id = repo.add(
                ScheduleEntity(
                    label = label,
                    hour = hour,
                    minute = minute,
                    durationMinutes = durationMinutes,
                    daysBitmask = daysBitmask
                )
            )
            ScheduleManager.scheduleNext(
                context,
                ScheduleEntity(id, label, hour, minute, durationMinutes, daysBitmask)
            )
        }
    }

    fun remove(context: Context, schedule: ScheduleEntity) {
        viewModelScope.launch {
            ScheduleManager.cancel(context, schedule)
            repo.remove(schedule.id)
        }
    }
}
