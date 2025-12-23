# Quick Start: Testing Backend Integration

## ✅ Backend Status

Your backend is **LIVE** at:
```
https://smart-agriculture-backend-my7c.onrender.com
```

## 🧪 Quick Test Commands

### 1. Test Backend Health

```bash
curl https://smart-agriculture-backend-my7c.onrender.com/
```

**Expected Response:** `ok`

---

### 2. Test Latest Sensor Data

```bash
curl https://smart-agriculture-backend-my7c.onrender.com/api/sensors/latest
```

**Expected Response:** JSON with sensor data

---

### 3. Test Pump Control

```bash
# Turn pump ON
curl -X POST https://smart-agriculture-backend-my7c.onrender.com/api/pump \
  -H "Content-Type: application/json" \
  -d '{"pump": true}'

# Turn pump OFF
curl -X POST https://smart-agriculture-backend-my7c.onrender.com/api/pump \
  -H "Content-Type: application/json" \
  -d '{"pump": false}'
```

---

### 4. Test Mode Change

```bash
# Set to AUTO mode
curl -X POST https://smart-agriculture-backend-my7c.onrender.com/api/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "AUTO"}'

# Set to MANUAL mode
curl -X POST https://smart-agriculture-backend-my7c.onrender.com/api/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "MANUAL"}'
```

---

## 📱 Testing in Mobile App

### Step 1: Verify Environment Variables

Check that `.env` file has:

```bash
EXPO_PUBLIC_API_URL=https://smart-agriculture-backend-my7c.onrender.com
EXPO_PUBLIC_WS_URL=wss://smart-agriculture-backend-my7c.onrender.com/ws
```

---

### Step 2: Restart Expo Dev Server

```bash
# Stop current server (Ctrl+C)
# Clear cache and restart
npx expo start -c
```

---

### Step 3: Test API Calls in App

Open the app and check the console logs for:

```
✅ Backend health check: true
✅ Latest sensor data loaded: {...}
✅ Model report loaded: {...}
```

---

### Step 4: Test Pump Control

1. Go to **Irrigation** tab
2. Toggle pump ON/OFF
3. Check console for: `✅ Pump control command sent: ON`

---

### Step 5: Test Mode Switching

1. Go to **Irrigation** tab
2. Switch between AUTO and MANUAL
3. Check console for: `✅ Mode changed to: AUTO`

---

## 🔍 Debugging Tips

### If Backend Returns 404

The endpoint might not exist. Check available endpoints:

```bash
curl https://smart-agriculture-backend-my7c.onrender.com/docs
```

---

### If Request Times Out

Backend might be sleeping (Render free tier). First request takes ~30 seconds to wake up.

**Solution:** Increase timeout in `services/api.ts`:

```typescript
const REQUEST_TIMEOUT = 30000; // 30 seconds for first request
```

---

### If WebSocket Won't Connect

Check if backend supports WebSocket:

```bash
# Test WebSocket connection
wscat -c wss://smart-agriculture-backend-my7c.onrender.com/ws
```

If not installed:
```bash
npm install -g wscat
```

---

### If Data Looks Wrong

Check backend logs on Render dashboard to see what data is being sent.

---

## 🎯 Expected Behavior

### ✅ Working Correctly

- App shows "Online" status
- Sensor data updates in real-time
- Pump control responds immediately
- Mode switching works
- No error messages in console

### ❌ Needs Fixing

- App shows "Offline" status
- Sensor data shows fallback/mock values
- Pump control doesn't respond
- Console shows network errors

---

## 📊 Monitoring Backend

### Check Backend Logs

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your service
3. Click "Logs" tab
4. Watch for incoming requests

---

### Check Request/Response

Use browser DevTools:

1. Open app in browser (Expo web)
2. Open DevTools (F12)
3. Go to Network tab
4. Filter by "Fetch/XHR"
5. Click on requests to see details

---

## 🚀 Next Steps

1. ✅ Test all endpoints with curl
2. ✅ Verify environment variables
3. ✅ Restart Expo dev server
4. ✅ Test in mobile app
5. ✅ Check console logs
6. ✅ Verify real-time updates
7. ✅ Test pump control
8. ✅ Test mode switching

---

## 💡 Pro Tips

### Tip 1: Use React DevTools

Install React DevTools to inspect component state and props.

### Tip 2: Enable Debug Mode

In `.env`:
```bash
EXPO_PUBLIC_DEBUG_MODE=true
```

This will show detailed API logs in console.

### Tip 3: Test on Physical Device

For best results, test on a physical device connected to the same network.

### Tip 4: Monitor Network Activity

Use Expo's network inspector:
```bash
npx expo start --dev-client
```

---

## 🆘 Common Issues

### Issue: "Network request failed"

**Cause:** Backend is unreachable or sleeping

**Solution:** Wait 30 seconds for backend to wake up, or check Render dashboard

---

### Issue: "Request timeout"

**Cause:** Backend is slow to respond

**Solution:** Increase timeout in `api.ts` or check backend performance

---

### Issue: "CORS error"

**Cause:** Backend doesn't allow requests from app origin

**Solution:** Add CORS headers to backend

---

### Issue: "Invalid JSON response"

**Cause:** Backend returned HTML error page instead of JSON

**Solution:** Check backend logs for errors

---

## ✅ Success Checklist

- [ ] Backend health check returns "ok"
- [ ] Latest sensor data endpoint returns JSON
- [ ] Pump control endpoint responds
- [ ] Mode change endpoint responds
- [ ] App shows "Online" status
- [ ] Sensor data updates in app
- [ ] Pump control works from app
- [ ] Mode switching works from app
- [ ] No errors in console
- [ ] Real-time updates working (if WebSocket enabled)

---

**Once all items are checked, your integration is complete!** 🎉
