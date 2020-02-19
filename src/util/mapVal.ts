// Re-maps a number from one range to another.
export default (
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
  withinBounds?: boolean
) => {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
  if (!withinBounds) {
    return newval
  }
  if (start2 < stop2) {
    return Math.max(Math.min(newval, stop2), start2)
  } else {
    return Math.max(Math.min(newval, start2), stop2)
  }
}
