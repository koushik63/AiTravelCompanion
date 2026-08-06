import { Logger } from '../utils/logger';

export class AILoggingService {
  static logPrompt(prompt: string, model: string = 'gemini-1.5-flash') {
    Logger.info(`[AI Engine (${model})]: Prompt length=${prompt.length} chars`, 'AIEngine');
  }

  static logResponse(status: 'success' | 'fallback', latencyMs: number) {
    Logger.info(`[AI Engine Response]: Status=${status}, Latency=${latencyMs}ms`, 'AIEngine');
  }
}
