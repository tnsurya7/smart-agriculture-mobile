# 🔧 Adding Debug Tab - Quick Guide

The debug tab file exists at: `app/(tabs)/debug.tsx`

But it needs to be added to the navigation. Here's how:

## 📝 Manual Steps

1. **Open file:** `app/(tabs)/_layout.tsx`

2. **Find line 287** (just before `</Tabs>`)

3. **Add this code** before `</Tabs>`:

```typescript
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
```

4. **Save the file**

5. **Rebuild the APK**:
```bash
eas build --platform android --profile preview
```

---

## ⚡ **Or Use This Quick Command**

Since manual editing is needed, let me create a complete new layout file for you to copy:

The debug tab will show:
- ✅ Push Token (full token visible)
- ✅ Connection Status
- ✅ Notification Status  
- ✅ Permission Status
- ✅ Sensor Data
- ✅ Console Logs
- ✅ Copy Token Button

---

## 🎯 **After Adding Debug Tab**

Your app will have 6 tabs:
1. Overview (Dashboard)
2. Sensors
3. Irrigation
4. Analytics
5. AI Models
6. **Debug** 🐛 (NEW!)

---

**Status:** Debug screen created, needs to be added to navigation manually or rebuild with it included.
