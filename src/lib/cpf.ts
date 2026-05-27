export function onlyDigits(s: string): string {
  return (s || "").replace(/\D/g, "");
}

export function formatCPF(input: string): string {
  const d = onlyDigits(input).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

export function maskCPF(input: string): string {
  const d = onlyDigits(input);
  if (d.length !== 11) return "";
  return `***.***.***-${d.slice(9, 11)}`;
}

export function isValidCPF(input: string): boolean {
  const d = onlyDigits(input);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;

  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(d[i], 10) * (len + 1 - i);
    const rem = (sum * 10) % 11;
    return rem === 10 ? 0 : rem;
  };

  return calc(9) === parseInt(d[9], 10) && calc(10) === parseInt(d[10], 10);
}
