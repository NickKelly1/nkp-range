export class InvalidStepSizeError extends TypeError {
  constructor(stepSize: number) {
    super(`Invalid step size: ${stepSize}. Step size must be a non-zero number.`);
  }
}

/**
 * Options for {@link range}
 */
export interface RangeOptions {
  /**
   * The number to start iterating from
   */
  start?: number;

  /**
   * The number to iterate until
   */
  end: number;

  /**
   * Maximum allowed step size
   */
  step?: number;

  /**
   * Is the right-most value to-be included in iteration?
   */
  inclusive?: boolean;
}

/**
 * RangeAttributes that can be safely updated while iterating
 */
export interface UpdateableRangeAttributes {
  /**
   * Final number to iterate to
   */
  end: number;

  /**
   * The number for the current iteration step to begin at
   */
  cursor: number;

  /**
   * Whether the final {@link RangeAttributes.end} value is included in the range
   */
  inclusive: boolean;

  /**
   * The size of the current step
   *
   * May be less than the given step size if it would exceed the end limit
   */
  step: number;
}


/**
 * RangeAttributes define current state values for iteration
 */
export interface RangeAttributes extends UpdateableRangeAttributes {
  /**
   * Initial number to start iterating from
   */
  readonly start: number;

  /**
   * Index of the current iteration step
   *
   * First iteration step is 0, then 1, 2, ...
   */
  readonly index: number;

  /**
   * The number the current iteration reaches
   *
   * If it would exceed {@link RangeAttributes.end} shrinks to it
   */
  readonly to: number;
}

export const DEFAULT_START = 0;
export const DEFAULT_STEP = 1;
export const DEFAULT_INCLUSIVE = false;

const UPDATEABLE_KEYS: { [K in keyof UpdateableRangeAttributes]: K } = {
  cursor: 'cursor',
  end: 'end',
  inclusive: 'inclusive',
  step: 'step',
};

/**
 * RangeState represents the current iteration state
 *
 * The state can be updated while iterating with {@link RangeState.set}
 */
export class RangeState implements RangeAttributes, Iterable<RangeState> {
  /**
   * Keys that can be updated by {@link RangeState.set}
   */
  public static UPDATEABLE_KEYS: Set<string> = new Set(Object.values(UPDATEABLE_KEYS));

  /**
   * Default {@link RangeAttributes.start} value
   */
  public static DEFAULT_START: undefined | number = undefined;

  /**
   * Default {@link RangeAttributes.step} value to use
   */
  public static DEFAULT_STEP: undefined | number = undefined;

  /**
   * Default {@link RangeAttributes.inclusive} value to use
   */
  public static DEFAULT_INCLUSIVE: undefined | boolean = undefined;

  /** @inheritdoc */ public get index(): number { return this._index; }

  /** @inheritdoc */ public get start(): number { return this._start; }

  /** @inheritdoc */ public end: number;

  /** @inheritdoc */ public cursor: number;

  /** @inheritdoc */ public get to() { return Math.min(this.cursor + this._step, this.end); }

  /**
   * when accessed the value will not be bounded by end
   *
   * the maximum value of {@link RangeState.step} summed with
   * {@link RangeState.cursor} will equal {@link RangeState.end}
   *
   * Otherwise, step will be whatever it was set to
   */
  public get step(): number {
    if (this._step < 0) return Math.max(this._step, this.end - this.cursor);
    return Math.min(this._step, this.end - this.cursor);
  }

  /**
   * May be set to any non-zero number
   *
   * @param step internal step value
   */
  public set step(step: number) {
    if (step === 0) throw new InvalidStepSizeError(step);
    this._step = step;
  }

  /** @inheritdoc */ public inclusive: boolean;

  /**
   * Update the state with a partial state
   *
   * @param to
   */
  public readonly set = (to: Partial<UpdateableRangeAttributes> | ((prev: this) => Partial<UpdateableRangeAttributes>)): void => {
    if (typeof to === 'function') this._write(to(this));
    else this._write(to);
  };

  /**
   * Is the current state within the range bounds?
   *
   * @param cursor test cursor to test whether is in bounds
   */
  public readonly isInBounds = (cursor: number = this.cursor): boolean => {
    if (this._step < 0) {
      // negative steps
      return this.inclusive
        ? cursor >= this.end
        : cursor > this.end;
    } else {
      // positive steps
      return this.inclusive
        ? cursor <= this.end
        : cursor < this.end;
    }
  };

  /**
   * Is the current state stepping out of the range bounds?
   */
  public readonly willBeInBounds = (): boolean => {
    return this.isInBounds(this.nextCursor());
  };

  protected _start: number;
  protected _step: number;
  protected _to: number;
  protected _index: number;

  /**
   * Create a new RangeState
   *
   * @param options
   */
  constructor(options: Readonly<RangeOptions>) {
    const { start, step: maxStepSize, end, inclusive, } = options;
    this._index = 0;
    this._start = start ?? RangeState.DEFAULT_START ?? DEFAULT_START;
    this.end = end;
    this.cursor = this.start;
    this._to = this.start;
    this._step = maxStepSize ?? RangeState.DEFAULT_STEP ?? DEFAULT_STEP;
    if (this._step === 0) throw new InvalidStepSizeError(this._step);
    this.inclusive = inclusive ?? RangeState.DEFAULT_INCLUSIVE ?? DEFAULT_INCLUSIVE;
  }

  /**
   * Iterate until bounds are exceeded
   *
   * Mutates the state as it goes
   */
  public * [Symbol.iterator](): IterableIterator<this> {
    while (this.isInBounds(this.cursor)) {
      yield this;
      this._commit();
    }
  }

  /**
   * Get the next cursor value
   *
   * @returns
   */
  public nextCursor(): number {
    /**
     * step with the unbounded {@link RangeState._step} so it can take us out of bounds
     * if we use the bounded {@link RangeState.step} it may be zero if we're at the limit
     * which would cause an infinite loop as cursor would not increment
     */
    return this.cursor + this._step;
  }

  /**
   * Write a partial state
   *
   * @param record
   */
  protected _write(record: Partial<UpdateableRangeAttributes>): void {
    // todo: upgrade typing
    const self: any = this;
    for (const [k, v,] of Object.entries(record)) {
      if (v == null) continue;
      if (!RangeState.UPDATEABLE_KEYS.has(k)) continue;
      self[k] = v;
    }
  }

  /**
   * Conclude the state at the end of an iteration
   */
  protected _commit(): void {
    this.cursor = this.nextCursor();
    this._index += 1;
  }
}

/**
 * Create an iterator for a discrete range
 *
 * Right exclusive by default
 *
 * @param options
 */
export function range(options: Readonly<RangeOptions>): IterableIterator<Readonly<RangeState>> {
  return new RangeState(options)[Symbol.iterator]();
}
