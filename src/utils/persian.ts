const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: number | string): string {
  if (input === undefined || input === null) return '';
  return input
    .toString()
    .replace(/[0-9]/g, (char) => PERSIAN_DIGITS[parseInt(char, 10)] ?? char);
}

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '۰';
  const rounded = Math.round(num);
  const withCommas = rounded.toLocaleString('en-US').replace(/,/g, '٬');
  return toPersianDigits(withCommas);
}

export function formatDistance(km: number, isEstimated = false): string {
  const formatted = formatNumber(km);
  return `${formatted} کیلومتر${isEstimated ? ' (تقریبی)' : ''}`;
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return '۰ دقیقه';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  if (hours > 0 && minutes > 0) {
    return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(minutes)} دقیقه`;
  } else if (hours > 0) {
    return `${toPersianDigits(hours)} ساعت`;
  }
  return `${toPersianDigits(minutes)} دقیقه`;
}

export function formatCurrency(toman: number): string {
  return `${formatNumber(toman)} تومان`;
}
