// vitest-axe ships its matcher type augmentation for the old `Vi` namespace,
// which Vitest 4 no longer uses. Declare the matcher on Vitest 4's interfaces.
import 'vitest'

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void
  }
}
