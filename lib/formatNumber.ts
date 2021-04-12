export default function formatNumber(number: number | bigint) {
  return new Intl.NumberFormat().format(number);
}
