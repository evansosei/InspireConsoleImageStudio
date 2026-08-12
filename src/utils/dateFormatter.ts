/**
 * Formats a given date (or current date) into dynamic professional uppercase format.
 * Example: "WEDNESDAY 12TH AUGUST 2026"
 */
export function getFormattedCurrentDate(dateInput?: Date): string {
  const date = dateInput || new Date();

  const days = [
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY',
    'THURSDAY', 'FRIDAY', 'SATURDAY'
  ];

  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Determine ordinal suffix
  let suffix = 'TH';
  if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) {
    suffix = 'ST';
  } else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) {
    suffix = 'ND';
  } else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) {
    suffix = 'RD';
  }

  return `${dayOfWeek} ${dayOfMonth}${suffix} ${month} ${year}`;
}
