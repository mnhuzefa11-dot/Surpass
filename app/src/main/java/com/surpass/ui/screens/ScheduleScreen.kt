package com.surpass.ui.screens

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithState
import androidx.lifecycle.viewmodel.compose.viewModel
import com.surpass.data.database.ScheduleEntity
import com.surpass.service.PermissionUtils
import com.surpass.viewmodel.ScheduleViewModel
import java.util.Calendar

private val DAY_LETTERS = listOf("S", "M", "T", "W", "T", "F", "S") // Sun..Sat

@Composable
fun ScheduleScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    val viewModel: ScheduleViewModel = viewModel()
    val schedules by viewModel.schedules.collectAsStateWithState()

    var label by remember { mutableStateOf("") }
    var hourText by remember { mutableStateOf("8") }
    var minuteText by remember { mutableStateOf("0") }
    var duration by remember { mutableIntStateOf(50) }
    var days by remember { mutableIntStateOf(0) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Text(text = "Schedules", style = MaterialTheme.typography.titleLarge)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !PermissionUtils.canScheduleExactAlarms(context)) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Exact alarm permission missing",
                        style = MaterialTheme.typography.titleSmall,
                        color = MaterialTheme.colorScheme.error
                    )
                    Text(
                        text = "Android 12+ needs this for sessions to start at the precise minute.",
                        style = MaterialTheme.typography.bodySmall
                    )
                    TextButton(onClick = {
                        context.startActivity(
                            Intent(
                                Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,
                                Uri.parse("package:" + context.packageName)
                            )
                        )
                    }) {
                        Text("Grant permission")
                    }
                }
            }
        }

        // Add-schedule form
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("New recurring session", style = MaterialTheme.typography.titleMedium)
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = label,
                    onValueChange = { label = it },
                    label = { Text("Label (e.g. Anatomy)") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    OutlinedTextField(
                        value = hourText,
                        onValueChange = { v -> hourText = v.filter { it.isDigit() }.take(2) },
                        label = { Text("Hour") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.width(90.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    OutlinedTextField(
                        value = minuteText,
                        onValueChange = { v -> minuteText = v.filter { it.isDigit() }.take(2) },
                        label = { Text("Min") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.width(90.dp)
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                    Text("Duration:", style = MaterialTheme.typography.bodyMedium)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row {
                    listOf(25, 50, 90).forEach { preset ->
                        FilterChip(
                            selected = duration == preset,
                            onClick = { duration = preset },
                            label = { Text("$preset m") },
                            modifier = Modifier.padding(end = 8.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row {
                    DAY_LETTERS.forEachIndexed { index, letter ->
                        val bit = 1 shl index
                        FilterChip(
                            selected = days and bit != 0,
                            onClick = { days = days xor bit },
                            label = { Text(letter) },
                            modifier = Modifier.padding(end = 6.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    enabled = label.isNotBlank() && days != 0,
                    onClick = {
                        viewModel.add(
                            context = context,
                            label = label.trim(),
                            hour = (hourText.toIntOrNull() ?: 8).coerceIn(0, 23),
                            minute = (minuteText.toIntOrNull() ?: 0).coerceIn(0, 59),
                            durationMinutes = duration,
                            daysBitmask = days
                        )
                        label = ""
                        days = 0
                    },
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Save schedule")
                }
            }
        }

        Text(
            text = "Your schedules",
            style = MaterialTheme.typography.titleMedium,
            modifier = Modifier.padding(horizontal = 20.dp)
        )
        Spacer(modifier = Modifier.height(8.dp))
        schedules.forEach { schedule ->
            ScheduleRow(
                schedule = schedule,
                onDelete = { viewModel.remove(context, schedule) }
            )
        }
        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
private fun ScheduleRow(schedule: ScheduleEntity, onDelete: () -> Unit) {
    val daysText = DAY_LETTERS.mapIndexed { index, letter ->
        if (schedule.daysBitmask and (1 shl index) != 0) letter else "·"
    }.joinToString(" ")
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = schedule.label, style = MaterialTheme.typography.titleSmall)
                Text(
                    text = String.format(
                        "%02d:%02d · %d min · %s",
                        schedule.hour,
                        schedule.minute,
                        schedule.durationMinutes,
                        daysText
                    ),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            IconButton(onClick = onDelete) {
                Icon(
                    Icons.Default.Delete,
                    contentDescription = "Delete schedule",
                    tint = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}
