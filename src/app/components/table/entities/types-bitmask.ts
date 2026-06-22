/* eslint-disable no-bitwise */

export enum Types {
  date = 1,
  dateString = 1,
  checkbox = 1 << 1,
  ordinalNumber = 1 << 2,
  status = 1 << 3,
  text = 1 << 4,
  number = 1 << 5,
  boolean = 1 << 6,
  progress = 1 << 7,
  integer = 1 << 8,
}

export enum AggregationFlags {
  min = 1,
  max = 1 << 2,
  sum = 1 << 3,
  avg = 1 << 4,
  first = 1 << 5,
  last = 1 << 6,
  count = 1 << 6,
  count_d = 1 << 8,
  median = 1 << 8,
}

export class BitMask {
  constructor(flags = 0) {
    this.setFlag(flags);
  }

  private flags = 0;

  setFlag(flag: number) {
    this.flags |= flag;
  }

  removeFlag(flag: number) {
    this.flags &= ~flag;
  }

  toggleFlag(flag: number) {
    this.flags ^= flag;
  }

  checkFlag(flag: number): boolean {
    return !!(this.flags & flag);
  }

  clearFlags() {
    this.flags = 0;
  }
}

export const numbersOnlyMask = new BitMask(parseInt('11010000', 2));
export const customCellRendererMask = new BitMask(parseInt('11001111', 2));
