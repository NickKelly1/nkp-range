import { range } from '.';

describe('range', () => {
  it('should create an iterator', () => {
    const iterator = range({ start: 0, end: 5, step: 1, });
    expect(typeof iterator).toBe('object');
    expect(typeof iterator.next).toBe('function');
  });

  it('should iterate', () => {
    let i = 0;
    let finalStep = 0;
    let finalCursor = 0;
    let finalTo = 0;
    for (const state of range({ start: 0, end: 5, step: 1, })) {
      const { cursor, to, step: step, end, } = state;
      expect(cursor).toEqual(i);
      expect(to).toEqual(i + 1);
      expect(step).toEqual(1);
      expect(end).toEqual(5);
      i += 1;
      finalStep = step;
      finalCursor = cursor;
      finalTo = to;
    }
    expect(finalStep).toBe(1);
    expect(finalCursor).toBe(4);
    expect(finalTo).toBe(5);
  });

  it('should use the inclusive option', () => {
    let finalStep = 0;
    let finalCursor = 0;
    let finalTo = 0;
    for (const state of range({ start: 0, end: 5, step: 1, inclusive: true, })) {
      const { cursor, step, to, } = state;
      finalStep = step;
      finalCursor = cursor;
      finalTo = to;
    }
    expect(finalStep).toBe(0);
    expect(finalCursor).toBe(5);
    expect(finalTo).toBe(5);
  });

  it('should use the step option', () => {
    let finalCursor = 0;
    let finalTo = 0;
    let i = 0;
    for (const state of range({ start: 0, end: 5, step: 2, })) {
      const { cursor, step, to, willBeInBounds, } = state;
      finalCursor = cursor;
      finalTo = to;
      expect(cursor).toBe(i * 2);
      if (willBeInBounds()) expect(step).toBe(2);
      i += 1;
    }
    expect(finalCursor).toBe(4);
    expect(finalTo).toBe(5);
  });

  it('should use the step & inclusive option (1)', () => {
    let finalCursor = 0;
    let finalTo = 0;
    let i = 0;
    for (const state of range({ start: 0, end: 5, step: 2, inclusive: true, })) {
      const { cursor, step, to, willBeInBounds, } = state;
      finalCursor = cursor;
      finalTo = to;
      expect(cursor).toBe(i * 2);
      if (willBeInBounds()) expect(step).toBe(2);
      i += 1;
    }
    expect(finalCursor).toBe(4);
    expect(finalTo).toBe(5);
  });

  it('should use the step & inclusive option (2)', () => {
    let finalCursor = 0;
    let finalTo = 0;
    let i = 0;
    for (const state of range({ start: 0, end: 6, step: 2, inclusive: true, })) {
      const { cursor, step, to, willBeInBounds, } = state;
      finalCursor = cursor;
      finalTo = to;
      expect(cursor).toBe(i * 2);
      if (willBeInBounds()) expect(step).toBe(2);
      i += 1;
    }
    expect(finalCursor).toBe(6);
    expect(finalTo).toBe(6);
  });
});
