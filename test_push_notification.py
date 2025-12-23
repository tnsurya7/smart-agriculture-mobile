#!/usr/bin/env python3
"""
Backend Push Notification Test Script
Sends a test notification to your Android device
"""

import requests
import json

# Your push token from the app
PUSH_TOKEN = "ExponentPushToken[vcq3lMKQ1pJ2ROoTCQJT1R]"

# Expo Push API endpoint
EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

def send_push_notification(token, title, body):
    """Send push notification via Expo Push API"""
    
    payload = {
        "to": token,
        "title": title,
        "body": body,
        "sound": "default",
        "channelId": "default",
        "priority": "high"
    }
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    print(f"📤 Sending notification to: {token}")
    print(f"📝 Title: {title}")
    print(f"📝 Body: {body}")
    print()
    
    try:
        response = requests.post(
            EXPO_PUSH_URL,
            headers=headers,
            data=json.dumps(payload)
        )
        
        print(f"✅ Response Status: {response.status_code}")
        print(f"📋 Response Body:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200:
            result = response.json()
            if result.get("data"):
                status = result["data"][0].get("status")
                if status == "ok":
                    print("\n🎉 SUCCESS! Notification sent!")
                    print("📱 Check your Android phone!")
                    return True
                else:
                    print(f"\n❌ Error: {result['data'][0]}")
                    return False
        else:
            print(f"\n❌ HTTP Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Smart Agriculture - Push Notification Test")
    print("=" * 60)
    print()
    
    # Send test notification
    success = send_push_notification(
        token=PUSH_TOKEN,
        title="🌱 Smart Agriculture Test",
        body="Push notification from backend working! 🎉"
    )
    
    if success:
        print("\n" + "=" * 60)
        print("✅ TEST PASSED!")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Check your Android phone")
        print("2. Notification should appear (even if app is closed)")
        print("3. If it works, backend integration is complete!")
    else:
        print("\n" + "=" * 60)
        print("❌ TEST FAILED")
        print("=" * 60)
        print()
        print("Troubleshooting:")
        print("1. Check if token is correct")
        print("2. Make sure phone has internet")
        print("3. Check response error message above")
