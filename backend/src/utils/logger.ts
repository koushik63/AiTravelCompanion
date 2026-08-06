export class Logger {
  static info(message: string, source: string = 'System') {
    console.log(`[INFO] [${new Date().toISOString()}] [${source}]: ${message}`);
  }

  static error(message: string, error?: any, source: string = 'System') {
    console.error(`[ERROR] [${new Date().toISOString()}] [${source}]: ${message}`, error || '');
  }

  static warn(message: string, source: string = 'System') {
    console.warn(`[WARN] [${new Date().toISOString()}] [${source}]: ${message}`);
  }
}
