/**
 * Lightweight schema-assertion helpers for API specs.
 *
 * These utilities validate that response objects conform to expected shapes
 * without pulling in a full JSON-schema library. Kept intentionally minimal —
 * if the suite grows, replace with `ajv` or similar.
 */

type ScalarType = 'string' | 'number' | 'boolean';

/**
 * Assert that `obj` contains all `keys`, each with the specified primitive type.
 *
 * @param obj    - The object to validate.
 * @param schema - A map of `{ fieldName: expectedType }`.
 *
 * @example
 * assertSchema(user, { id: 'number', email: 'string', first_name: 'string' });
 */
export function assertSchema(
  obj: Record<string, unknown>,
  schema: Record<string, ScalarType>
): void {
  for (const [key, type] of Object.entries(schema)) {
    expect(obj, `schema: key "${key}" must exist`).to.have.property(key);
    expect(typeof obj[key], `schema: "${key}" must be ${type}`).to.equal(type);
  }
}
