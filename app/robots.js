export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/'
      },
      {
        // Explicitly target and allow AI/Answer engine user-agents for AEO optimization
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'Google-Extended', 'PerplexityBot', 'OAI-SearchBot'],
        allow: '/'
      }
    ],
    sitemap: 'https://www.evconsults.pk/sitemap.xml',
    host: 'https://www.evconsults.pk',
  };
}
