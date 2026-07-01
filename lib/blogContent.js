/**
 * Blog content helpers — clean editor artifacts and build card excerpts.
 */

const EMPTY_HTML_PATTERNS = [
  /<p>\s*<br\s*\/?>\s*<\/p>/gi,
  /<p>\s*<\/p>/gi,
  /<div>\s*<br\s*\/?>\s*<\/div>/gi,
  /<div>\s*<\/div>/gi,
  /<br\s*\/?>/gi,
];

/** Remove empty HTML blocks and normalize whitespace in blog body/excerpt. */
export function cleanBlogContent(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text.replace(/\r\n/g, '\n');

  for (const pattern of EMPTY_HTML_PATTERNS) {
    cleaned = cleaned.replace(pattern, '\n');
  }

  // Strip remaining HTML tags (mixed HTML + markdown from editors)
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');

  cleaned = cleaned
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

/** Convert markdown to plain text for excerpts. */
export function stripMarkdown(text) {
  if (!text) return '';

  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/-{3,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Build a plain-text excerpt capped at maxLength with word-safe truncation. */
export function generateExcerpt(body, maxLength = 160) {
  const plain = stripMarkdown(cleanBlogContent(body));
  if (!plain) return '';

  if (plain.length <= maxLength) return plain;

  const truncated = plain.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  const cut = lastSpace > Math.floor(maxLength * 0.6) ? truncated.slice(0, lastSpace) : truncated;

  return `${cut.trim()}…`;
}

/**
 * Resolve the short summary shown on blog listing cards.
 * Uses excerpt when valid; otherwise derives from body. Never returns full body HTML/markdown.
 */
export function getBlogCardExcerpt(excerpt, body, maxLength = 160) {
  const cleanedExcerpt = stripMarkdown(cleanBlogContent(excerpt || ''));

  if (cleanedExcerpt.length >= 10) {
    return cleanedExcerpt.length <= maxLength
      ? cleanedExcerpt
      : generateExcerpt(cleanedExcerpt, maxLength);
  }

  return generateExcerpt(body, maxLength);
}

/** Normalize blog fields before save (admin create/update). */
export function prepareBlogPostForSave(data) {
  const body = cleanBlogContent(data.body || '');
  const rawExcerpt = stripMarkdown(cleanBlogContent(data.excerpt || ''));

  let excerpt = rawExcerpt;
  if (excerpt.length < 10) {
    excerpt = generateExcerpt(body, 160);
  } else if (excerpt.length > 220) {
    excerpt = generateExcerpt(excerpt, 160);
  }

  return {
    ...data,
    body,
    excerpt,
  };
}
