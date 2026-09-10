package com.surpass

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.surpass.ui.screens.AnalyticsScreen
import com.surpass.ui.screens.BlockedAppsScreen
import com.surpass.ui.screens.HomeScreen
import com.surpass.ui.screens.ScheduleScreen
import com.surpass.ui.screens.TimerScreen
import com.surpass.ui.theme.SurpassTheme

private enum class Screen { HOME, TIMER, BLOCKED_APPS, SCHEDULE, ANALYTICS }

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SurpassTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    SurpassApp()
                }
            }
        }
    }
}

@Composable
private fun SurpassApp() {
    var currentScreen by remember { mutableStateOf(Screen.HOME) }

    when (currentScreen) {
        Screen.HOME -> HomeScreen(
            onStartSessionClick = { currentScreen = Screen.TIMER },
            onManageBlockedAppsClick = { currentScreen = Screen.BLOCKED_APPS },
            onScheduleClick = { currentScreen = Screen.SCHEDULE },
            onAnalyticsClick = { currentScreen = Screen.ANALYTICS }
        )
        Screen.TIMER -> TimerScreen(
            onBack = { currentScreen = Screen.HOME }
        )
        Screen.BLOCKED_APPS -> BlockedAppsScreen(
            onBack = { currentScreen = Screen.HOME }
        )
        Screen.SCHEDULE -> ScheduleScreen(
            onBack = { currentScreen = Screen.HOME }
        )
        Screen.ANALYTICS -> AnalyticsScreen(
            onBack = { currentScreen = Screen.HOME }
        )
    }
}
