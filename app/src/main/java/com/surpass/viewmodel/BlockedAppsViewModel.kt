package com.surpass.viewmodel

import android.content.Context
import android.content.pm.ApplicationInfo
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.surpass.AppContainer
import com.surpass.data.database.BlockedAppEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class AppInfo(
    val packageName: String,
    val label: String
)

class BlockedAppsViewModel : ViewModel() {

    private val repo = AppContainer.blockedAppRepo

    val blocked: StateFlow<List<BlockedAppEntity>> = repo.all()
        .stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())

    private val _installed = MutableStateFlow<List<AppInfo>>(emptyList())
    val installed: StateFlow<List<AppInfo>> get() = _installed

    fun loadInstalled(context: Context) {
        if (_installed.value.isNotEmpty()) return
        viewModelScope.launch(Dispatchers.Default) {
            val pm = context.packageManager
            val apps = pm.getInstalledApplications(0)
                .mapNotNull { info: ApplicationInfo ->
                    pm.getLaunchIntentForPackage(info.packageName)?.let {
                        AppInfo(info.packageName, info.loadLabel(pm).toString())
                    }
                }
                .sortedBy { it.label.lowercase() }
            _installed.value = apps
        }
    }

    fun setBlocked(app: AppInfo, blocked: Boolean) {
        viewModelScope.launch {
            if (blocked) repo.add(app.packageName, app.label)
            else repo.remove(app.packageName)
        }
    }
}
