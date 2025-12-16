export const formatTimestamp = (
  timestamp: string | number | Date,
  format = 1,
) => {
  if (!timestamp) return null;

  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0)

  // Format 2: Date only (e.g., "January 15, 2024")
  if (format == 2) {
    return `${month} ${day}, ${year}`;
  }

  // Format 1: Full timestamp (e.g., "15 January 2024 • 2:30 pm")
  return `${day} ${month.slice(0, 3)} ${year} • ${hours}:${minutes} ${ampm}`;
};
