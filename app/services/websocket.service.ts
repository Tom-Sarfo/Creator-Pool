import { API_CONFIG } from "../lib/api-config";
import type {
  WebSocketEvents,
  Pool,
  Prediction,
  PoolStatus,
} from "../lib/types";

// WebSocket client for real-time updates
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000; // Start with 1 second
  private maxReconnectInterval = 30000; // Max 30 seconds
  private isConnecting = false;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    this.isConnecting = true;

    try {
      const wsUrl = API_CONFIG.WS_URL;
      console.log("Connecting to WebSocket:", wsUrl);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectInterval = 1000;
        this.startHeartbeat();
        this.emit("connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        this.isConnecting = false;
        this.stopHeartbeat();
        this.emit("disconnected");

        if (
          !event.wasClean &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        this.emit("error", error);
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      this.emit("maxReconnectAttemptsReached");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectInterval * this.reconnectAttempts,
      this.maxReconnectInterval
    );

    console.log(
      `Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`
    );

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleMessage(data: any): void {
    if (data.type === "pong") {
      // Heartbeat response
      return;
    }

    // Handle different message types
    switch (data.type) {
      case "poolUpdate":
        this.emit("poolUpdate", data.data);
        break;
      case "newPrediction":
        this.emit("newPrediction", data.data);
        break;
      case "probabilityUpdate":
        this.emit("probabilityUpdate", data.data);
        break;
      case "poolStatusChange":
        this.emit("poolStatusChange", data.data);
        break;
      default:
        console.log("Unknown WebSocket message type:", data.type);
    }
  }

  // Join a pool room to receive updates for that specific pool
  joinPool(poolId: string): void {
    this.send({
      type: "joinPool",
      poolId,
    });
  }

  // Leave a pool room
  leavePool(poolId: string): void {
    this.send({
      type: "leavePool",
      poolId,
    });
  }

  // Join user-specific room for personal updates
  joinUser(userId: string): void {
    this.send({
      type: "joinUser",
      userId,
    });
  }

  // Leave user-specific room
  leaveUser(userId: string): void {
    this.send({
      type: "leaveUser",
      userId,
    });
  }

  // Send a message to the server
  private send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not connected, cannot send message:", data);
    }
  }

  // Event listener management
  on<K extends keyof WebSocketEvents>(
    event: K,
    callback: (data: WebSocketEvents[K]) => void
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off<K extends keyof WebSocketEvents>(
    event: K,
    callback: (data: WebSocketEvents[K]) => void
  ): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit<K extends keyof WebSocketEvents>(
    event: K,
    data?: WebSocketEvents[K]
  ): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data as WebSocketEvents[K]);
        } catch (error) {
          console.error(
            `Error in WebSocket event listener for ${event}:`,
            error
          );
        }
      });
    }
  }

  // Get connection status
  getConnectionStatus(): "connecting" | "connected" | "disconnected" | "error" {
    if (this.isConnecting) return "connecting";
    if (this.ws) {
      switch (this.ws.readyState) {
        case WebSocket.CONNECTING:
          return "connecting";
        case WebSocket.OPEN:
          return "connected";
        case WebSocket.CLOSING:
        case WebSocket.CLOSED:
          return "disconnected";
        default:
          return "error";
      }
    }
    return "disconnected";
  }

  // Disconnect and cleanup
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }
    this.eventListeners.clear();
  }

  // Reconnect manually
  reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

// Create singleton instance
export const wsClient = new WebSocketClient();

// Hook for using WebSocket in React components
export function useWebSocket() {
  return {
    wsClient,
    connectionStatus: wsClient.getConnectionStatus(),
    joinPool: wsClient.joinPool.bind(wsClient),
    leavePool: wsClient.leavePool.bind(wsClient),
    joinUser: wsClient.joinUser.bind(wsClient),
    leaveUser: wsClient.leaveUser.bind(wsClient),
    on: wsClient.on.bind(wsClient),
    off: wsClient.off.bind(wsClient),
    reconnect: wsClient.reconnect.bind(wsClient),
  };
}

// Utility functions for WebSocket events
export const WebSocketUtils = {
  // Format pool update for display
  formatPoolUpdate: (data: WebSocketEvents["poolUpdate"]) => {
    return {
      poolId: data.poolId,
      participants: data.pool.participants,
      totalStake: data.pool.totalStake,
      yesStake: data.pool.yesStake,
      noStake: data.pool.noStake,
      probabilityYes: data.pool.probabilityYes,
      probabilityNo: data.pool.probabilityNo,
      status: data.pool.status,
    };
  },

  // Format prediction update for display
  formatPredictionUpdate: (data: WebSocketEvents["newPrediction"]) => {
    return {
      poolId: data.poolId,
      predictionId: data.prediction.id,
      choice: data.prediction.choice,
      stake: data.prediction.stake,
      predictorId: data.prediction.predictorId,
      predictedAt: data.prediction.predictedAt,
    };
  },

  // Format probability update for display
  formatProbabilityUpdate: (data: WebSocketEvents["probabilityUpdate"]) => {
    return {
      poolId: data.poolId,
      probabilityYes: data.probabilityYes,
      probabilityNo: data.probabilityNo,
      timestamp: new Date().toISOString(),
    };
  },

  // Format status change for display
  formatStatusChange: (data: WebSocketEvents["poolStatusChange"]) => {
    return {
      poolId: data.poolId,
      oldStatus: data.oldStatus,
      newStatus: data.newStatus,
      timestamp: new Date().toISOString(),
    };
  },
};
