export function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export function formatVndK(amount: number): string {
  if (amount % 1000 !== 0) return formatVnd(amount);
  return `${amount / 1000}k`;
}
