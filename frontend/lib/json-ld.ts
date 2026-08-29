/**
 * Safe JSON-LD serialization helper.
 * Prevents HTML context breakout (e.g. </script> XSS attacks) when rendering JSON-LD scripts.
 */
export function serializeJsonLd<T extends Record<string, unknown>>(data: T): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
