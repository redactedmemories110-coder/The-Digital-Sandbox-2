/**
 * Seeded PRNG for reproducible, deterministic simulation cycles.
 * Uses a linear congruential generator (LCG) / Mulberry32 style.
 */
export class DeterministicRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed ? Math.floor(Math.abs(seed)) : 123456789;
  }

  // Returns pseudo-random float in [0, 1)
  nextFloat(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Returns integer in [min, max] inclusive
  nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  // Pick random item from array
  pick<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    const idx = this.nextInt(0, array.length - 1);
    return array[idx];
  }

  // Return a shuffled copy of array
  shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Roll probability check (0 - 100)
  chance(percentage: number): boolean {
    return this.nextFloat() * 100 < percentage;
  }
}
