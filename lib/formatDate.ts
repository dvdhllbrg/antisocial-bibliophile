export default function formatDate(date: string) {
  return (date ? new Date(date).toLocaleDateString() : 'at an unknown date');
}
