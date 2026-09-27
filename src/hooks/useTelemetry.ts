import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface TelemetryMetrics {
  cursorVelocity: number;
  hesitationTimeMs: number;
  rageClickCount: number;
  errorCount: number;
  targetField: string;
}

export interface CognitiveState {
  cognitiveLoadScore: number;
  status: 'LOW' | 'MEDIUM' | 'HIGH_FRICTION';
  lastMetrics: TelemetryMetrics;
  history: { timestamp: number; score: number; targetField: string }[];
  triggered: boolean;
}

export interface PipelineStatus {
  stage: 'IDLE' | 'GENERATING_CODE' | 'AST_SAFETY_INSPECTION' | 'READY' | 'ERROR';
  message: string;
}

export interface GeneratedComponentPayload {
  code: string;
  source: string;
  astMetrics: {
    executionTimeMs: number;
    nodesAnalyzed: number;
    securityChecksPassed: boolean;
    totalPipelineTimeMs: number;
  };
  targetField: string;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function useTelemetry() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>({
    cognitiveLoadScore: 0,
    status: 'LOW',
    lastMetrics: {
      cursorVelocity: 0,
      hesitationTimeMs: 0,
      rageClickCount: 0,
      errorCount: 0,
      targetField: 'General Portal'
    },
    history: [],
    triggered: false
  });

  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>({
    stage: 'IDLE',
    message: ''
  });

  const [generatedComponent, setGeneratedComponent] = useState<GeneratedComponentPayload | null>(null);

  // Tracking refs
  const mousePosRef = useRef({ x: 0, y: 0, time: Date.now() });
  const velocityRef = useRef(0);
  const hesitationStartRef = useRef(Date.now());
  const clickHistoryRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const rageClicksRef = useRef(0);
  const activeFieldRef = useRef<string>('Tax Schedule Input');
  const errorCountRef = useRef(0);

  // Initialize WebSocket Socket.io connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('[Telemetry Tracker] Connected to backend WebSocket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Telemetry Tracker] Disconnected from WebSocket');
      setIsConnected(false);
    });

    newSocket.on('session_state', (state: CognitiveState) => {
      setCognitiveState(state);
    });

    newSocket.on('telemetry_update', (state: CognitiveState) => {
      setCognitiveState(state);
    });

    newSocket.on('healing_status', (status: { stage: string; message: string }) => {
      setPipelineStatus({
        stage: status.stage as PipelineStatus['stage'],
        message: status.message
      });
    });

    newSocket.on('component_ready', (payload: GeneratedComponentPayload) => {
      console.log('[Telemetry Tracker] Dynamic Self-Healing Component Ready!');
      setGeneratedComponent(payload);
      setPipelineStatus({
        stage: 'READY',
        message: 'Synthesized, AST-validated safe component loaded!'
      });
    });

    newSocket.on('healing_reset', () => {
      setGeneratedComponent(null);
      setPipelineStatus({ stage: 'IDLE', message: '' });
      rageClicksRef.current = 0;
      errorCountRef.current = 0;
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Event Listeners for Mouse Velocity, Hesitation, Rage Clicks
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - mousePosRef.current.time;
      if (dt > 20) {
        const dx = e.clientX - mousePosRef.current.x;
        const dy = e.clientY - mousePosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = (dist / dt) * 1000; // px/sec

        velocityRef.current = velocityRef.current * 0.4 + speed * 0.6;
        mousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
        hesitationStartRef.current = now; // reset hesitation when mouse moves significantly
      }
    };

    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      const click = { x: e.clientX, y: e.clientY, time: now };

      // Keep clicks in last 1000ms
      const recentClicks = [...clickHistoryRef.current.filter(c => now - c.time < 1000), click];
      clickHistoryRef.current = recentClicks;

      // Detect Rage Clicks (3+ clicks within 400ms in a 40px radius)
      if (recentClicks.length >= 3) {
        const first = recentClicks[0];
        const dist = Math.sqrt(Math.pow(click.x - first.x, 2) + Math.pow(click.y - first.y, 2));
        if (dist < 40) {
          rageClicksRef.current += 1;
        }
      }
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
        const fieldName = target.getAttribute('name') || target.getAttribute('placeholder') || target.id || 'Financial Input Field';
        activeFieldRef.current = fieldName;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('focusin', handleFocus);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('focusin', handleFocus);
    };
  }, []);

  // Interval streamer every 500ms
  useEffect(() => {
    if (!socket || !isConnected) return;

    const interval = setInterval(() => {
      const hesitationTimeMs = Date.now() - hesitationStartRef.current;

      const payload: TelemetryMetrics = {
        cursorVelocity: velocityRef.current,
        hesitationTimeMs,
        rageClickCount: rageClicksRef.current,
        errorCount: errorCountRef.current,
        targetField: activeFieldRef.current
      };

      socket.emit('telemetry_stream', payload);

      // Decay velocity slowly
      velocityRef.current *= 0.8;
    }, 500);

    return () => clearInterval(interval);
  }, [socket, isConnected]);

  const triggerManualHealing = useCallback((targetField?: string) => {
    if (socket) {
      setPipelineStatus({ stage: 'GENERATING_CODE', message: 'Simulating high friction trigger...' });
      socket.emit('manual_trigger_healing', { targetField });
    }
  }, [socket]);

  const resetSession = useCallback(() => {
    if (socket) {
      socket.emit('reset_session');
    }
  }, [socket]);

  const incrementErrorCount = useCallback(() => {
    errorCountRef.current += 1;
  }, []);

  return {
    isConnected,
    cognitiveState,
    pipelineStatus,
    generatedComponent,
    triggerManualHealing,
    resetSession,
    incrementErrorCount
  };
}
