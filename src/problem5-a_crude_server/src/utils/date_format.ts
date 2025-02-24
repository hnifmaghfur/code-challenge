/**
 * Formats a date to SQLite datetime format (YYYY-MM-DD HH:MM:SS)
 */
export function toSQLiteDateTime(date: Date = new Date()): string {
  return date.toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '');
}
