# Backend API Hooks - Usage Examples

## 📚 Available Hooks

All hooks are available in `hooks/useBackendAPI.ts`:

- `useBackendHealth()` - Check backend connectivity
- `useLatestSensorData()` - Fetch latest sensor readings
- `useSensorHistory()` - Fetch historical sensor data
- `usePumpControl()` - Control irrigation pump
- `useModeControl()` - Switch operation modes
- `useModelReport()` - Get ML model performance
- `useWeatherData()` - Get weather forecast
- `useSystemStatus()` - Get system health info
- `useBackendData()` - Combined hook for all data

---

## 🎯 Usage Examples

### Example 1: Display Latest Sensor Data

```typescript
import { useLatestSensorData } from '../hooks/useBackendAPI';
import { View, Text, ActivityIndicator } from 'react-native';

function SensorDisplay() {
  // Auto-refresh every 5 seconds
  const { data, loading, error, refetch } = useLatestSensorData(true, 5000);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  if (!data) return <Text>No data available</Text>;

  return (
    <View>
      <Text>Soil Moisture: {data.soil}%</Text>
      <Text>Temperature: {data.temperature}°C</Text>
      <Text>Humidity: {data.humidity}%</Text>
      <Button title="Refresh" onPress={refetch} />
    </View>
  );
}
```

---

### Example 2: Pump Control Button

```typescript
import { usePumpControl } from '../hooks/useBackendAPI';
import { Button, Alert } from 'react-native';
import { useState } from 'react';

function PumpControlButton() {
  const [pumpOn, setPumpOn] = useState(false);
  const { setPump, loading, error } = usePumpControl();

  const handleToggle = async () => {
    try {
      await setPump(!pumpOn);
      setPumpOn(!pumpOn);
      Alert.alert('Success', `Pump turned ${!pumpOn ? 'ON' : 'OFF'}`);
    } catch (err) {
      Alert.alert('Error', error || 'Failed to control pump');
    }
  };

  return (
    <Button
      title={pumpOn ? 'Turn Pump OFF' : 'Turn Pump ON'}
      onPress={handleToggle}
      disabled={loading}
    />
  );
}
```

---

### Example 3: Mode Switcher

```typescript
import { useModeControl } from '../hooks/useBackendAPI';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';

function ModeSwitcher() {
  const [currentMode, setCurrentMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const { setMode, loading, error } = useModeControl();

  const handleModeChange = async (newMode: 'AUTO' | 'MANUAL') => {
    try {
      await setMode(newMode);
      setCurrentMode(newMode);
    } catch (err) {
      console.error('Failed to change mode:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentMode === 'AUTO' && styles.active]}
        onPress={() => handleModeChange('AUTO')}
        disabled={loading}
      >
        <Text>AUTO</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, currentMode === 'MANUAL' && styles.active]}
        onPress={() => handleModeChange('MANUAL')}
        disabled={loading}
      >
        <Text>MANUAL</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 10 },
  button: { padding: 10, backgroundColor: '#ddd', borderRadius: 5 },
  active: { backgroundColor: '#4CAF50' },
});
```

---

### Example 4: Backend Health Indicator

```typescript
import { useBackendHealth } from '../hooks/useBackendAPI';
import { View, Text } from 'react-native';

function BackendHealthIndicator() {
  const { isHealthy, loading, checkHealth } = useBackendHealth();

  if (loading) return <Text>Checking backend...</Text>;

  return (
    <View>
      <Text style={{ color: isHealthy ? 'green' : 'red' }}>
        Backend: {isHealthy ? 'Online ✅' : 'Offline ❌'}
      </Text>
      <Button title="Recheck" onPress={checkHealth} />
    </View>
  );
}
```

---

### Example 5: Sensor History Chart

```typescript
import { useSensorHistory } from '../hooks/useBackendAPI';
import { View, Text, ScrollView } from 'react-native';

function SensorHistoryChart() {
  // Fetch last 50 records
  const { history, loading, error, refetch } = useSensorHistory(50);

  if (loading) return <Text>Loading history...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <ScrollView>
      <Text>Sensor History ({history.length} records)</Text>
      {history.map((record, index) => (
        <View key={index}>
          <Text>
            {record.timestamp}: Soil {record.soil}%, Temp {record.temperature}°C
          </Text>
        </View>
      ))}
      <Button title="Refresh" onPress={refetch} />
    </ScrollView>
  );
}
```

---

### Example 6: Weather Widget

```typescript
import { useWeatherData } from '../hooks/useBackendAPI';
import { View, Text } from 'react-native';

function WeatherWidget() {
  // Auto-refresh every 5 minutes (300000ms)
  const { weather, loading, error } = useWeatherData(true, 300000);

  if (loading) return <Text>Loading weather...</Text>;
  if (error) return <Text>Weather unavailable</Text>;
  if (!weather) return null;

  return (
    <View>
      <Text>📍 {weather.location}</Text>
      <Text>🌡️ {weather.temperature}°C</Text>
      <Text>💧 Humidity: {weather.humidity}%</Text>
      <Text>🌧️ Rain: {weather.rain_probability}%</Text>
      {weather.rain_expected && <Text>⚠️ Rain expected!</Text>}
    </View>
  );
}
```

---

### Example 7: ML Model Performance

```typescript
import { useModelReport } from '../hooks/useBackendAPI';
import { View, Text } from 'react-native';

function ModelPerformance() {
  const { report, loading, error } = useModelReport();

  if (loading) return <Text>Loading model report...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!report) return null;

  return (
    <View>
      <Text>Best Model: {report.best_model}</Text>
      <Text>ARIMAX Accuracy: {report.arimax_accuracy}%</Text>
      <Text>ARIMAX RMSE: {report.arimax_rmse}</Text>
      <Text>Training Rows: {report.rows}</Text>
    </View>
  );
}
```

---

### Example 8: System Status Dashboard

```typescript
import { useSystemStatus } from '../hooks/useBackendAPI';
import { View, Text } from 'react-native';

function SystemStatusDashboard() {
  const { status, loading, error, refetch } = useSystemStatus();

  if (loading) return <Text>Loading system status...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!status) return null;

  return (
    <View>
      <Text>Total Records: {status.total_rows}</Text>
      <Text>Last Retrain: {status.last_retrain}</Text>
      <Text>Next Retrain: {status.next_retrain}</Text>
      <Text>
        Sensor: {status.sensor_connectivity ? '✅ Connected' : '❌ Disconnected'}
      </Text>
      <Text>
        Logging: {status.data_logging_active ? '✅ Active' : '❌ Inactive'}
      </Text>
      <Button title="Refresh" onPress={refetch} />
    </View>
  );
}
```

---

### Example 9: Complete Dashboard (Combined Hook)

```typescript
import { useBackendData } from '../hooks/useBackendAPI';
import { View, Text, ActivityIndicator } from 'react-native';

function CompleteDashboard() {
  const {
    isHealthy,
    sensorData,
    report,
    weather,
    status,
    loading,
    refetchSensor,
  } = useBackendData();

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Loading dashboard data...</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Backend Status */}
      <Text>Backend: {isHealthy ? '✅ Online' : '❌ Offline'}</Text>

      {/* Sensor Data */}
      {sensorData && (
        <View>
          <Text>Soil: {sensorData.soil}%</Text>
          <Text>Temp: {sensorData.temperature}°C</Text>
          <Text>Humidity: {sensorData.humidity}%</Text>
        </View>
      )}

      {/* Weather */}
      {weather && (
        <View>
          <Text>Weather: {weather.temperature}°C</Text>
          <Text>Rain: {weather.rain_probability}%</Text>
        </View>
      )}

      {/* ML Model */}
      {report && (
        <View>
          <Text>Model: {report.best_model}</Text>
          <Text>Accuracy: {report.arimax_accuracy}%</Text>
        </View>
      )}

      {/* System Status */}
      {status && (
        <View>
          <Text>Records: {status.total_rows}</Text>
          <Text>Logging: {status.data_logging_active ? 'Active' : 'Inactive'}</Text>
        </View>
      )}

      <Button title="Refresh Sensors" onPress={refetchSensor} />
    </View>
  );
}
```

---

## 🎨 Advanced Patterns

### Pattern 1: Error Boundary

```typescript
import { useLatestSensorData } from '../hooks/useBackendAPI';
import { View, Text, Button } from 'react-native';

function SensorDataWithErrorBoundary() {
  const { data, loading, error, refetch } = useLatestSensorData();

  if (error) {
    return (
      <View>
        <Text>⚠️ Failed to load sensor data</Text>
        <Text>{error}</Text>
        <Button title="Retry" onPress={refetch} />
      </View>
    );
  }

  if (loading) return <Text>Loading...</Text>;
  if (!data) return <Text>No data</Text>;

  return (
    <View>
      <Text>Soil: {data.soil}%</Text>
    </View>
  );
}
```

---

### Pattern 2: Optimistic Updates

```typescript
import { usePumpControl } from '../hooks/useBackendAPI';
import { useState } from 'react';
import { Button } from 'react-native';

function OptimisticPumpControl() {
  const [pumpOn, setPumpOn] = useState(false);
  const { setPump, loading } = usePumpControl();

  const handleToggle = async () => {
    // Optimistic update
    const newState = !pumpOn;
    setPumpOn(newState);

    try {
      await setPump(newState);
      // Success - state already updated
    } catch (err) {
      // Rollback on error
      setPumpOn(!newState);
      Alert.alert('Error', 'Failed to control pump');
    }
  };

  return (
    <Button
      title={pumpOn ? 'Pump ON' : 'Pump OFF'}
      onPress={handleToggle}
      disabled={loading}
    />
  );
}
```

---

### Pattern 3: Polling with Cleanup

```typescript
import { useLatestSensorData } from '../hooks/useBackendAPI';
import { useEffect } from 'react';

function PollingExample() {
  // Poll every 3 seconds
  const { data, refetch } = useLatestSensorData(true, 3000);

  useEffect(() => {
    // Component-specific polling logic
    const interval = setInterval(() => {
      console.log('Polling sensor data...');
      refetch();
    }, 3000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [refetch]);

  return <Text>Soil: {data?.soil}%</Text>;
}
```

---

## 🔧 Configuration

### Customize Refresh Intervals

```typescript
// Fast refresh (every 2 seconds)
const { data } = useLatestSensorData(true, 2000);

// Medium refresh (every 10 seconds)
const { data } = useLatestSensorData(true, 10000);

// Slow refresh (every 1 minute)
const { data } = useLatestSensorData(true, 60000);

// No auto-refresh (manual only)
const { data, refetch } = useLatestSensorData(false);
```

---

### Handle Loading States

```typescript
const { data, loading, error } = useLatestSensorData();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <DataDisplay data={data} />;
```

---

## 📖 Best Practices

1. **Always handle loading states** - Show spinners or skeletons
2. **Always handle errors** - Show user-friendly error messages
3. **Use auto-refresh wisely** - Don't poll too frequently
4. **Clean up intervals** - Prevent memory leaks
5. **Provide manual refresh** - Let users force refresh
6. **Show connection status** - Use `useBackendHealth()`
7. **Implement retry logic** - Allow users to retry failed requests
8. **Use optimistic updates** - For better UX on slow connections

---

## 🎯 Integration Checklist

- [ ] Import hooks from `hooks/useBackendAPI.ts`
- [ ] Handle loading states with spinners
- [ ] Handle error states with messages
- [ ] Implement manual refresh buttons
- [ ] Configure appropriate refresh intervals
- [ ] Test with slow network conditions
- [ ] Test with backend offline
- [ ] Add user feedback for actions
- [ ] Implement retry logic for failures
- [ ] Clean up intervals on unmount

---

**Your hooks are ready to use! Start integrating them into your components.** 🚀
