import { logger } from './logger';

interface AnalyticsEvent {
  name: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];
  private readonly maxEvents = 1000;

  private constructor() {}

  static getInstance(): Analytics {
    if (!this.instance) {
      this.instance = new Analytics();
    }
    return this.instance;
  }

  trackEvent(name: string, data?: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      name,
      timestamp: Date.now(),
      data
    };

    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    logger.debug('Analytics event tracked', event);
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
  }
}

export const analytics = Analytics.getInstance();