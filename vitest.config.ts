import { defineConfig } from 'vitest/config'

/**
 * Unit-test surface for the pure progress derivations. Tests import only
 * package sources plus type-only @deepseek-ai imports (erased at runtime),
 * so no path mapping or DOM environment is needed — the default node
 * environment suffices. Component behavior stays covered by the harness's
 * own snapshot suite; this suite pins the token-rate math.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'],
  },
})
