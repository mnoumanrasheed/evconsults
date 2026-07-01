/**
 * Helper to normalize users' queries and perform security audits, direct template responses,
 * and topic-based matching for EV charging station compliance questions.
 */

import { matchEVCSQuestion, isEVCSComplianceQuestion } from '@/lib/evcsAnswers';

function normalizeMessage(rawMessage) {
  let normalized = rawMessage.toLowerCase();
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '');
  normalized = normalized.replace(/\s+/g, ' ').trim();
  normalized = normalized.replace(/\binforamtion\b/g, 'information');
  normalized = normalized.replace(/\bchatbvot\b/g, 'chatbot');
  return normalized;
}

export function chatbotAnswer(rawMessage) {
  const normalized = normalizeMessage(rawMessage);

  const sensitiveKeywords = [
    'password', 'credential', 'database_url', 'db_url', 'secret_key',
    'env', 'user table', 'admin email', 'admin login', 'admin password',
    'connection string', 'auth token', 'contact request',
    'neon', 'railway', 'vercel', 'jwt', 'api key', 'system prompt',
    'internal file', 'server config', '.env',
  ];

  if (sensitiveKeywords.some((kw) => normalized.includes(kw))) {
    return 'For security reasons, I cannot share private credentials or internal system details. Please contact the authorized EVConsults team.';
  }

  // NEPRA Chapter 16 / IESCO compliance — detailed local answers
  const evcsAnswer = matchEVCSQuestion(normalized);
  if (evcsAnswer) return evcsAnswer;

  const isCompliance = isEVCSComplianceQuestion(normalized);

  const hasService =
    !isCompliance &&
    (normalized.includes('service') || normalized.includes('offer') || normalized.includes('do you do'));
  if (hasService) {
    return 'EVConsults offers complete EV charging consultancy services in Pakistan, including:\n1. **Feasibility Study** (commercially, financially, and technically evaluating your site)\n2. **NEPRA Licensing Support** (handling all applications and compliance)\n3. **Equipment Selection** (vendor-neutral AC vs DC charger reviews)\n4. **DISCO/Utility Coordination** (load approvals and connection setup).\n\nLearn more on our [Services](/services) page.';
  }

  const hasLicense =
    !isCompliance &&
    (normalized.includes('license') || normalized.includes('licensing') || normalized.includes('register'));
  if (hasLicense) {
    return 'We provide full support for obtaining electric vehicle charging station licenses and registrations from **NEPRA** and local distribution companies (like K-Electric, LESCO, IESCO). We manage the documentation, load audits, and compliance checks. Check out our [Licensing](/licensing) page for full details.';
  }

  const hasIndustry =
    normalized.includes('industry') ||
    normalized.includes('industries') ||
    normalized.includes('who do you serve') ||
    normalized.includes('segment');
  if (hasIndustry && !isCompliance) {
    return 'We design EV charging solutions for various business segments in Pakistan, such as:\n- Petrol pumps & fuel stations\n- Housing societies & townships\n- Shopping malls & retail hubs\n- Hotels & restaurants\n- Commercial fleets & logistics\n- Motorways & highway stopovers.\n\nRead more on our [Industries](/industries) page.';
  }

  const hasContact =
    (normalized.includes('contact') ||
      normalized.includes('email') ||
      normalized.includes('phone') ||
      normalized.includes('address') ||
      normalized.includes('reach')) &&
    !normalized.includes('complaint') &&
    !normalized.includes('overbilling') &&
    !normalized.includes('dispute') &&
    !normalized.includes('emergency contact sign');
  if (hasContact && !isCompliance) {
    return 'You can reach EVConsults in the following ways:\n- **Email**: alviaatif@hotmail.com\n- **Phone**: 0322 5131504 or 0332 8271005\n- **WhatsApp**: Click the floating button on the bottom right\n- **Web Form**: Submit an inquiry on our [Contact Us](/contact) page.';
  }

  const hasAbout =
    (normalized.includes('about') || normalized.includes('who are you') || normalized.includes('company')) &&
    !normalized.includes('nepra');
  if (hasAbout && !isCompliance) {
    return "EVConsults is Pakistan's trusted advisory platform for EV charging infrastructure development. We assist investors, petrol pump owners, townships, and fleet operators in launching profitable and legally compliant charging stations. Check out our [About Us](/about) page.";
  }

  const hasBlog =
    normalized.includes('blog') ||
    normalized.includes('insight') ||
    normalized.includes('news') ||
    normalized.includes('article');
  if (hasBlog && !isCompliance) {
    return 'We publish expert analysis, regulatory updates, and guides on our [Insights Blog](/blog). Topics include NEPRA regulations, charging station setup guides, and investment outlooks.';
  }

  return 'FALLBACK_REQUIRED';
}
