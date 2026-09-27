const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const TelemetryEngine = require('./telemetryEngine');
const { generateSelfHealingComponent } = require('./codeGenAgent');
const { inspectAndSanitizeAST } = require('./astSafetyEngine');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Per-connection telemetry instance
const sessionEngines = new Map();

io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);
  const engine = new TelemetryEngine();
  sessionEngines.set(socket.id, engine);

  // Send initial session state
  socket.emit('session_state', engine.sessionState);

  // Streaming Telemetry Data from React Hook
  socket.on('telemetry_stream', async (data) => {
    const session = sessionEngines.get(socket.id);
    if (!session) return;

    const { state, shouldTriggerHealing } = session.processTelemetry(data);
    socket.emit('telemetry_update', state);

    if (shouldTriggerHealing) {
      session.setTriggered();
      await triggerSelfHealingPipeline(socket, state);
    }
  });

  // Manual Trigger for testing / demonstration
  socket.on('manual_trigger_healing', async (customContext) => {
    const session = sessionEngines.get(socket.id);
    if (!session) return;

    session.setTriggered();
    const context = {
      cognitiveLoadScore: 92,
      lastMetrics: {
        cursorVelocity: 2100,
        hesitationTimeMs: 4500,
        rageClickCount: 4,
        errorCount: 2,
        targetField: customContext?.targetField || 'Section 3: EBITDA & Deferred Tax Liabilities'
      }
    };
    await triggerSelfHealingPipeline(socket, context);
  });

  // Reset Trigger to test morph back
  socket.on('reset_session', () => {
    const session = sessionEngines.get(socket.id);
    if (session) {
      session.resetTrigger();
      socket.emit('telemetry_update', session.sessionState);
      socket.emit('healing_reset');
    }
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    sessionEngines.delete(socket.id);
  });
});

async function triggerSelfHealingPipeline(socket, state) {
  const startTime = Date.now();
  console.log(`[Self-Healing Pipeline] Triggered for client ${socket.id} at Cognitive Load: ${state.cognitiveLoadScore}`);

  socket.emit('healing_status', {
    stage: 'GENERATING_CODE',
    message: 'Analyzing user friction points & prompting Code-Gen Agent...'
  });

  // 1. Code-Gen Agent Step
  const genResult = await generateSelfHealingComponent(state);

  socket.emit('healing_status', {
    stage: 'AST_SAFETY_INSPECTION',
    message: 'Parsing AST, validating safety policies & transforming JSX via Babel...'
  });

  // 2. AST Safety Engine Step
  const astResult = inspectAndSanitizeAST(genResult.code);

  const totalPipelineTimeMs = Date.now() - startTime;

  if (astResult.safe) {
    socket.emit('component_ready', {
      success: true,
      code: astResult.code,
      source: genResult.source,
      astMetrics: {
        ...astResult.metrics,
        totalPipelineTimeMs
      },
      targetField: state.lastMetrics?.targetField || 'Tax Schedule C'
    });
  } else {
    socket.emit('healing_error', {
      error: astResult.error,
      violations: astResult.violations
    });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'AuraGen Backend Pipeline', timestamp: new Date() });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` AuraGen Cognitive Self-Healing Server Running!`);
  console.log(` WebSocket Port: ${PORT}`);
  console.log(`====================================================`);
});
