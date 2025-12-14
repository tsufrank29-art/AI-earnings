export function isArchived(callDate: string) {
  const days = (Date.now() - new Date(callDate).getTime()) / (1000 * 60 * 60 * 24);
  return days > 90;
}
