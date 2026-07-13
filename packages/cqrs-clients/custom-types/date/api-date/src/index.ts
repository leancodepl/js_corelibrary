class ApiDateOnly {
  declare private _: never
}
class ApiDateTime {
  declare private _: never
}
class ApiTimeSpan {
  declare private _: never
}

class ApiTimeOnly {
  declare private _: never
}

class ApiDateTimeOffset {
  declare private _: never
}

// Type-only so the brands stay un-instantiable, while remaining nameable in
// downstream declaration emit (avoids TS4094 when a consumer's public type
// inlines one of these brands).
export type { ApiDateOnly, ApiDateTime, ApiDateTimeOffset, ApiTimeOnly, ApiTimeSpan }
