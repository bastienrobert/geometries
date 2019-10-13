export function normalize3(a: number[]): number[] {
  let out = []
  const x = a[0]
  const y = a[1]
  const z = a[2]
  let len = x * x + y * y + z * z
  if (len > 0) len = 1 / Math.sqrt(len)
  out[0] = x * len
  out[1] = y * len
  out[2] = z * len
  return out
}

export function subtract3(a: number[], b: number[]): number[] {
  let out = []
  out[0] = a[0] - b[0]
  out[1] = a[1] - b[1]
  out[2] = a[2] - b[2]
  return out
}
