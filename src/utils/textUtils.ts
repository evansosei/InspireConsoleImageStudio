/**
 * Ensures text is properly enclosed in double quotation marks ("...") at the beginning and end.
 */
export function getQuotedText(text?: string): string {
  const content = (text || '').trim();
  if (!content) {
    return '"Write your motivational message here..."';
  }

  // Strip leading and trailing quotes first to prevent duplicate quotes
  const cleaned = content.replace(/^["“”«»]+/, '').replace(/["“”«»]+$/, '').trim();

  if (!cleaned) {
    return '""';
  }

  return `"${cleaned}"`;
}
