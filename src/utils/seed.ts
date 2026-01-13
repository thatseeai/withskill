/**
 * Simple Linear Congruential Generator (LCG) for reproducible pseudo-random numbers
 * Using same seed will always generate same sequence
 */
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  /**
   * Generate next random number between 0 and 1
   */
  next(): number {
    // LCG formula: (a * seed + c) % m
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32
    this.seed = (a * this.seed + c) % m
    return this.seed / m
  }

  /**
   * Generate random integer between min (inclusive) and max (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)]
  }

  /**
   * Shuffle array (Fisher-Yates algorithm)
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

// Export singleton with fixed seed for reproducibility
export const seededRandom = new SeededRandom(42)
