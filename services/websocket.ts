/**
 * WebSocket Service for Smart Agriculture Mobile App
 * Handles real-time communication with ESP32 device
 */

import { SensorData } from '../types';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export class SmartFarmWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 2000;

  // Callbacks
  public onConnectionChange: ((status: ConnectionStatus) => void) | null = null;
  public onSensorData: ((data: SensorData) => void) | null = null;
  public onError: ((error: string) => void) | null = null;

  constructor(url?: string) {
    // Use environment variable or fallback to localhost
    this.url = url || process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
    console.log('🔌 WebSocket initialized with URL:', this.url);
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('⚠️ WebSocket already connected');
      return;
    }

    console.log('🔌 Connecting to WebSocket:', this.url);
    this.onConnectionChange?.('connecting');

    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (error) {
      // Silently handle connection creation errors
      this.onError?.('Failed to create WebSocket connection');
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    console.log('🔌 Disconnecting WebSocket');

    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.onConnectionChange?.('disconnected');
  }

  /**
   * Send pump control command
   */
  sendPumpCommand(state: 'ON' | 'OFF'): void {
    if (!this.isConnected()) {
      console.warn('⚠️ Cannot send pump command - WebSocket not connected');
      return;
    }

    const message = {
      pump_cmd: state
    };

    this.send(message);
    console.log('📤 Sent pump command:', state);
  }

  /**
   * Send mode control command
   */
  sendModeCommand(mode: 'AUTO' | 'MANUAL'): void {
    if (!this.isConnected()) {
      console.warn('⚠️ Cannot send mode command - WebSocket not connected');
      return;
    }

    const message = {
      mode: mode.toLowerCase()
    };

    this.send(message);
    console.log('📤 Sent mode command:', mode);
  }

  /**
   * Send rain forecast update
   */
  sendRainForecast(rainExpected: boolean): void {
    if (!this.isConnected()) {
      console.warn('⚠️ Cannot send rain forecast - WebSocket not connected');
      return;
    }

    const message = {
      rain_expected: rainExpected
    };

    this.send(message);
    console.log('📤 Sent rain forecast:', rainExpected);
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): ConnectionStatus {
    if (!this.ws) return 'disconnected';

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      default:
        return 'disconnected';
    }
  }

  /**
   * Setup WebSocket event listeners
   */
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.onConnectionChange?.('connected');

      // Register as dashboard client
      this.send({
        type: 'register',
        role: 'dashboard',
        id: 'mobile-app'
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        // Silently handle parse errors
      }
    };

    this.ws.onclose = (event) => {
      console.log('🔌 WebSocket disconnected:', event.code, event.reason);
      this.onConnectionChange?.('disconnected');

      // Only attempt reconnect if it wasn't a manual disconnect
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      // Silently handle WebSocket errors
      this.onError?.('WebSocket connection error');
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: WebSocketMessage): void {
    console.log('📥 Received WebSocket message:', data.type || 'unknown');

    // Only process messages from ESP32
    if (data.source !== 'esp32') {
      console.log('⏭️ Ignoring non-ESP32 message:', data.type || 'unknown');
      return;
    }

    console.log('✅ ESP32 message detected, processing...');

    // Normalize sensor data with safe defaults
    const sensorData: SensorData = {
      soil: typeof data.soil === 'number' ? data.soil : 0,
      temperature: typeof data.temperature === 'number' ? data.temperature : 0,
      humidity: typeof data.humidity === 'number' ? data.humidity : 0,
      rainRaw: typeof data.rain_raw === 'number' ? data.rain_raw : 4095,
      rainDetected: Boolean(data.rain_detected),
      ldr: typeof data.light_raw === 'number' ? data.light_raw : 500,
      lightPercent: typeof data.light_percent === 'number' ? data.light_percent : 50,
      lightStatus: data.light_state || 'normal',
      flow: typeof data.flow === 'number' ? data.flow : 0,
      totalLiters: typeof data.total === 'number' ? data.total : 0,
      pump: (typeof data.pump === 'number' && (data.pump === 0 || data.pump === 1)) ? data.pump as (0 | 1) : 0,
      mode: (data.mode === 'auto' || data.mode === 'manual')
        ? data.mode.toUpperCase() as 'AUTO' | 'MANUAL'
        : 'AUTO',
      rainExpected: Boolean(data.rain_expected),
    };

    console.log('✅ Normalized ESP32 data:', sensorData);
    this.onSensorData?.(sensorData);
  }

  /**
   * Send message to WebSocket server
   */
  private send(message: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ Cannot send message - WebSocket not connected');
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      // Silently handle send errors
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    // Robust reconnection: Retry indefinitely but with capped delay
    // if (this.reconnectAttempts >= this.maxReconnectAttempts) { ... } // Removed limit

    this.reconnectAttempts++;

    // Exponential backoff, capped at 30 seconds
    let delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    if (delay > 30000) delay = 30000;

    console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);

    // Clear any existing timeout
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }

    this.reconnectInterval = setTimeout(() => {
      this.connect();
    }, delay);
  }
}

// Export singleton instance
export const smartFarmWebSocket = new SmartFarmWebSocket();