/**
 * Telemetry & Friction Engine
 * Processes streaming user interaction metrics (mouse speed, hesitation, rage clicks, error rates)
 * to compute a real-time Cognitive Load Score (0-100).
 */

class TelemetryEngine {
  constructor() {
    this.sessionState = {
      cognitiveLoadScore: 0,
      status: 'LOW', // LOW, MEDIUM, HIGH_FRICTION
      lastMetrics: {
        cursorVelocity: 0,
        hesitationTimeMs: 0,
        rageClickCount: 0,
        errorCount: 0,
        targetField: null
      },
      history: [],
      triggered: false
    };
  }

  processTelemetry(data) {
    const { cursorVelocity = 0, hesitationTimeMs = 0, rageClicks = 0, errors = 0, targetField = 'general' } = data;

    // Weighting factors
    const velocityWeight = Math.min((cursorVelocity / 2500) * 20, 20); // max 20 pts
    const hesitationWeight = Math.min((hesitationTimeMs / 4000) * 35, 35); // max 35 pts
    const rageClickWeight = Math.min(rageClicks * 25, 50); // max 50 pts (rage clicks are high indicator)
    const errorWeight = Math.min(errors * 15, 30); // max 30 pts

    // Calculate score bounded 0 - 100
    let rawScore = velocityWeight + hesitationWeight + rageClickWeight + errorWeight;
    let score = Math.min(Math.round(rawScore), 100);

    // Apply smoothing with existing score to prevent erratic jumps
    let smoothedScore = Math.round(this.sessionState.cognitiveLoadScore * 0.3 + score * 0.7);

    let status = 'LOW';
    if (smoothedScore >= 70 || rageClicks >= 3) {
      status = 'HIGH_FRICTION';
    } else if (smoothedScore >= 40) {
      status = 'MEDIUM';
    }

    this.sessionState = {
      cognitiveLoadScore: smoothedScore,
      status,
      lastMetrics: {
        cursorVelocity: Math.round(cursorVelocity),
        hesitationTimeMs: Math.round(hesitationTimeMs),
        rageClickCount: rageClicks,
        errorCount: errors,
        targetField
      },
      history: [
        ...this.sessionState.history.slice(-19),
        { timestamp: Date.now(), score: smoothedScore, targetField }
      ],
      triggered: this.sessionState.triggered
    };

    return {
      state: this.sessionState,
      shouldTriggerHealing: smoothedScore >= 65 && !this.sessionState.triggered
    };
  }

  resetTrigger() {
    this.sessionState.triggered = false;
    this.sessionState.cognitiveLoadScore = 15;
    this.sessionState.status = 'LOW';
  }

  setTriggered() {
    this.sessionState.triggered = true;
  }
}

module.exports = TelemetryEngine;
