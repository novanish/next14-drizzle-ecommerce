export const PostgresErrorCode = {
  UniqueViolation: "23505",
  NotNullViolation: "23502",
  ForeignKeyViolation: "23503",
} as const;

export interface DatabaseError {
  code: (typeof PostgresErrorCode)[keyof typeof PostgresErrorCode];
  detail: string;
  table: string;
  column?: string;
}

export function isDatabaseError(value: unknown): value is DatabaseError {
  if (!isRecord(value)) {
    return false;
  }

  const { code, detail, table } = value;
  return Boolean(code && detail && table);
}

function isRecord<K extends string | number | symbol, V>(
  value: unknown
): value is Record<K, V> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
