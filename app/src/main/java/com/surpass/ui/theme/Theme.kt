package com.surpass.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Block-style green palette.
private val Green = Color(0xFF43A047)
private val GreenDark = Color(0xFF2E7D32)
private val GreenLight = Color(0xFFC8E6C9)
private val Ink = Color(0xFF1B2A1C)

private val SurpassLightColors = lightColorScheme(
    primary = Green,
    onPrimary = Color.White,
    primaryContainer = GreenLight,
    onPrimaryContainer = Color(0xFF1B5E20),
    secondary = Color(0xFF66BB6A),
    onSecondary = Color.White,
    secondaryContainer = GreenLight,
    onSecondaryContainer = Color(0xFF1B5E20),
    tertiary = Color(0xFF8D6E63),
    onTertiary = Color.White,
    background = Color(0xFFFAFDF9),
    onBackground = Ink,
    surface = Color.White,
    onSurface = Ink,
    surfaceVariant = Color(0xFFE8F2E8),
    onSurfaceVariant = Color(0xFF405042),
    error = Color(0xFFBA1A1A),
    onError = Color.White
)

@Composable
fun SurpassTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = SurpassLightColors,
        content = content
    )
}

/** "12:34" or "1:02:03" for a remaining-millis value. */
fun formatRemaining(millis: Long): String {
    val totalSeconds = (millis.coerceAtLeast(0) + 999) / 1000
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return if (minutes >= 60) {
        String.format("%d:%02d:%02d", minutes / 60, minutes % 60, seconds)
    } else {
        String.format("%d:%02d", minutes, seconds)
    }
}
