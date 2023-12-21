export const hash = (string: string, digits = 4): number => {;
  const m = Math.pow(10, digits+1) - 1;
  const phi = Math.pow(10, digits) / 2 - 1;
  let n = 0;
  for (let i = 0; i < string.length; i++) {
    n = (n + phi * string.charCodeAt(i)) % m;
  }
  return n;
}
