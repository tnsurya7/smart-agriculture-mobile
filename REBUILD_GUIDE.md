# 🚀 Quick Rebuild Guide

## ✅ **Option 1: Rebuild APK Now (Without Debug Tab)**

The debug tab file exists, but it's not in the navigation yet. You can still rebuild and use the **alert popup** to see the push token!

```bash
eas build --platform android --profile preview
```

**What you'll get:**
- ✅ Alert popup showing push token when app opens
- ✅ All other features working
- ❌ No debug tab (need to add to navigation first)

---

## ✅ **Option 2: Add Debug Tab First, Then Rebuild**

### **Step 1: Edit Navigation File**

Open: `app/(tabs)/_layout.tsx`

Find line **287** which says:
```typescript
    </Tabs>
```

**Add this BEFORE that line:**

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

### **Step 2: Save and Commit**

```bash
git add app/(tabs)/_layout.tsx
git commit -m "Add debug tab to navigation"
```

### **Step 3: Rebuild**

```bash
eas build --platform android --profile preview
```

---

## 🎯 **Recommendation**

**For VIVA:** Option 1 is fine! The alert popup works great!

**For production:** Option 2 gives you the debug tab.

---

## ⏱️ **Build Time**

- EAS Build takes: **10-15 minutes**
- You'll get a download link when done
- Install on Android phone

---

## 📱 **What You'll See After Rebuild**

### **With Alert (Option 1):**
```
App opens → Alert pops up with push token → Copy it!
```

### **With Debug Tab (Option 2):**
```
App opens → Navigate to Debug tab → See full system status
```

---

**Choose your option and let me know!** 🚀
