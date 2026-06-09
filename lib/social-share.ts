/** WhatsApp click-to-chat with prefilled message (works on mobile and desktop). */
export function buildWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Instagram has no web share URL — copy link and open Instagram so the user can paste. */
export async function shareViaInstagram(url: string): Promise<'copied' | 'failed'> {
  const ok = await copyTextToClipboard(url);
  if (!ok) return 'failed';
  window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  return 'copied';
}
