import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../styles/theme";
import GradientText from "../../components/GradientText";

const HeaderWithIcon = ({ title, icon, color }: { title: string, icon: any, color?: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name={icon} size={20} color={color || colors.text.primary} style={{ marginRight: 8 }} />
    <Text style={{ fontWeight: "700", fontSize: 20, letterSpacing: -0.3, color: colors.text.primary }}>{title}</Text>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.start,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.glass.ultra,
          borderTopWidth: 0.5,
          borderTopColor: colors.glass.border,
          elevation: 0,
          shadowOpacity: 0.1,
          shadowColor: colors.glass.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
          height: 85,
          paddingBottom: 25,
          paddingTop: 8,
          position: 'absolute',
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={colors.background.liquid as any}
            style={{
              flex: 1,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderWidth: 0.5,
              borderColor: colors.glass.border,
              borderBottomWidth: 0,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.3,
          color: colors.text.primary,
        },
        headerStyle: {
          backgroundColor: colors.glass.ultra,
          elevation: 0,
          shadowOpacity: 0.1,
          shadowColor: colors.glass.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.glass.border,
        },
        headerBackground: () => (
          <LinearGradient
            colors={colors.background.primary as any}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 20,
          letterSpacing: -0.3,
          color: colors.text.primary,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Overview",
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>🌾 </Text>
              <Text style={{ fontWeight: "700", fontSize: 20, letterSpacing: -0.3, color: '#000000' }}>
                Smart Agriculture
              </Text>
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? colors.glass.light : 'transparent',
              marginTop: 4,
            }}>
              {focused && (
                <LinearGradient
                  colors={colors.primary.liquid as any}
                  style={{
                    position: 'absolute',
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    opacity: 0.15,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                size={22}
                color={focused ? colors.primary.start : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sensors"
        options={{
          title: "Sensors",
          headerTitle: () => (
            <HeaderWithIcon title="Sensor Data" icon="stats-chart" color={colors.sensors.temperature[0]} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? colors.glass.light : 'transparent',
              marginTop: 4,
            }}>
              {focused && (
                <LinearGradient
                  colors={colors.sensors.temperature as any}
                  style={{
                    position: 'absolute',
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    opacity: 0.15,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <Ionicons
                name={focused ? "analytics" : "analytics-outline"}
                size={22}
                color={focused ? colors.sensors.temperature[0] : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="irrigation"
        options={{
          title: "Irrigation",
          headerTitle: () => (
            <HeaderWithIcon title="Auto Irrigation" icon="water" color={colors.sensors.flow[0]} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? colors.glass.light : 'transparent',
              marginTop: 4,
            }}>
              {focused && (
                <LinearGradient
                  colors={['#00BFFF', '#4A90E2']}
                  style={{
                    position: 'absolute',
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    opacity: 0.15,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <Ionicons
                name={focused ? "water" : "water-outline"}
                size={22}
                color={focused ? '#00BFFF' : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          headerTitle: () => (
            <HeaderWithIcon title="Data Analytics" icon="analytics" color={colors.status.info[0]} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? colors.glass.light : 'transparent',
              marginTop: 4,
            }}>
              {focused && (
                <LinearGradient
                  colors={colors.status.info as any}
                  style={{
                    position: 'absolute',
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    opacity: 0.15,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <Ionicons
                name={focused ? "bar-chart" : "bar-chart-outline"}
                size={22}
                color={focused ? colors.status.info[0] : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="models"
        options={{
          title: "AI Models",
          headerTitle: () => (
            <HeaderWithIcon title="Model Comparison" icon="hardware-chip" color={colors.status.success[0]} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? colors.glass.light : 'transparent',
              marginTop: 4,
            }}>
              {focused && (
                <LinearGradient
                  colors={colors.status.success as any}
                  style={{
                    position: 'absolute',
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    opacity: 0.15,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <Ionicons
                name={focused ? "hardware-chip" : "hardware-chip-outline"}
                size={22}
                color={focused ? colors.status.success[0] : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          title: "Debug",
          headerTitle: () => (
            <HeaderWithIcon title="Debug Console" icon="bug" color="#f44336" />
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? colors.glass.light : 'transparent',
              marginTop: 4,
            }}>
              {focused && (
                <LinearGradient
                  colors={['#f44336', '#e91e63'] as any}
                  style={{
                    position: 'absolute',
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    opacity: 0.15,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
              <Ionicons
                name={focused ? "bug" : "bug-outline"}
                size={22}
                color={focused ? '#f44336' : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}