import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { getEVCSKnowledge } from '@/lib/evcsKnowledge';
import { chatbotAnswer } from '@/lib/chatbotAnswer';
import { matchEVCSQuestion } from '@/lib/evcsAnswers';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1).max(2000)
    })
  )
});

async function getPublicKnowledge() {
  try {
    // 1. Fetch Pages and sections
    const pages = await prisma.page.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });

    let pagesText = "PAGES AND SECTION CONTENT:\n";
    pages.forEach(page => {
      pagesText += `\nPage: ${page.title} (Slug: ${page.slug})\n`;
      pagesText += `SEO Title: ${page.seoTitle || ''}\nSEO Description: ${page.seoDesc || ''}\n`;
      page.sections.forEach(sec => {
        pagesText += `- Section Key: ${sec.key}\n`;
        pagesText += `  Content: ${JSON.stringify(sec.content)}\n`;
      });
    });

    // 2. Fetch published blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        category: true
      }
    });

    let blogsText = "\nPUBLISHED BLOG POSTS:\n";
    blogPosts.forEach(post => {
      blogsText += `- Title: ${post.title}\n  Category: ${post.category}\n  Excerpt: ${post.excerpt}\n  Link/Slug: /blog/${post.slug}\n`;
    });

    // 3. Fetch global settings
    const settings = await prisma.globalSetting.findMany({
      where: { key: { in: ['contact', 'footer'] } }
    });

    let settingsText = "\nGLOBAL SETTINGS & CONTACT INFO:\n";
    settings.forEach(set => {
      settingsText += `- Key: ${set.key}\n  Value: ${JSON.stringify(set.value)}\n`;
    });

    return `${pagesText}\n${blogsText}\n${settingsText}`;
  } catch (err) {
    console.error('Error fetching public knowledge for chatbot:', err);
    return "EVConsults is an EV charging infrastructure consultancy in Pakistan. We help petrol pumps, housing societies, hotels, fleets, highways, and shopping malls setup EV stations, covering NEPRA licensing, feasibility, financial ROI modeling, and technical commissioning. Contact: email alviaatif@hotmail.com, phone 0322 5131504 or 0332 8271005.";
  }
}

function getMockResponse(query) {
  const q = query.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '').replace(/\s+/g, ' ').trim();

  if (q.includes('password') || q.includes('admin login') || q.includes('admin password') || q.includes('credential') || q.includes('secret') || q.includes('env') || q.includes('db_url') || q.includes('neon') || q.includes('railway') || q.includes('vercel') || q.includes('jwt') || q.includes('api key') || q.includes('system prompt')) {
    return 'For security reasons, I cannot share private credentials or internal system details. Please contact the authorized EVConsults team.';
  }

  const evcsAnswer = matchEVCSQuestion(q);
  if (evcsAnswer) return evcsAnswer;

  const localReply = chatbotAnswer(query);
  if (localReply !== 'FALLBACK_REQUIRED') return localReply;

  return 'FALLBACK_REQUIRED';
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Zod validation
    const validation = chatSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const { messages } = validation.data;

    // Fetch dynamic context
    const knowledgeBase = await getPublicKnowledge();
    const evcsKnowledge = getEVCSKnowledge();

    // Check for sensitive keywords in user query (defense-in-depth)
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Normalization, security checks and EVCS matches handled locally first:
    const localReply = chatbotAnswer(lastUserMessage);
    if (localReply !== "FALLBACK_REQUIRED") {
      return NextResponse.json({ message: localReply });
    }

    const sensitiveKeywords = [
      'password', 'credential', 'database_url', 'db_url', 'secret_key',
      'env', 'user table', 'admin email', 'admin login', 'admin password',
      'connection string', 'auth token', 'contact request',
      'neon', 'railway', 'vercel', 'jwt', 'api key', 'system prompt', '.env',
    ];

    const containsSensitive = sensitiveKeywords.some(kw =>
      lastUserMessage.toLowerCase().includes(kw)
    );

    if (containsSensitive) {
      return NextResponse.json({
        message: "For security reasons, I cannot share private credentials or internal system details. Please contact the authorized EVConsults team."
      });
    }

    // Call OpenAI or fallback
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn("OPENAI_API_KEY is not set. Using local rule-based responder fallback.");
      let reply = getMockResponse(lastUserMessage);
      if (reply.trim().toUpperCase().includes("FALLBACK_REQUIRED")) {
        const encodedQuery = encodeURIComponent(lastUserMessage.trim());
        reply = `This query requires expert review. Please contact EVConsults on [WhatsApp](https://wa.me/923225131504?text=I%20need%20help%20regarding%20EVConsults:%20${encodedQuery}).`;
      }
      return NextResponse.json({ message: reply });
    }

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are EVBot, the official friendly AI assistant of EVConsults Pakistan.
Act as an expert EV charging station compliance consultant for Pakistan, especially regarding IESCO EV station connections and NEPRA Chapter 16 regulations.

Here is the verified PUBLIC knowledge base of EVConsults from the database:
=== WEBSITE KNOWLEDGE BASE ===
${knowledgeBase}
======================

Here is the EVCS / NEPRA / IESCO knowledge base:
=== EVCS KNOWLEDGE BASE ===
${evcsKnowledge}
======================

INSTRUCTIONS & BEHAVIOR:
1. ONLY use information from the verified KNOWLEDGE BASES above. Do not hallucinate. If something is not available in the document, say: "This specific point is not clearly mentioned in the provided document; however, based on the document, the practical approach is..."
2. Always answer in a professional, clear, and structured manner. Do not give one-line answers when detailed context is needed.
3. When the user asks about documents, NOCs, licenses, connection process, tariff, transformer, metering, safety, earthing, fire protection, or IESCO approval, provide complete practical information combining multiple relevant sections from the EVCS Knowledge Base.
4. If the answer depends on missing information, clearly state the assumption and answer practically.
5. Do not answer unrelated questions outside EV charging compliance unless asked generally.
6. TRANSFORMER SIZING RULE: If asked about transformer sizing, ALWAYS calculate using: kVA = kW / power factor. Example: for 120 kW, at 0.9 PF = 133.33 kVA, so 150 kVA is practically safer than 100 kVA. Always mention final approval depends on IESCO load study, feeder capacity, transformer loading, and site survey.
7. NEECA LICENSE RULE: If asked whether NEECA license is required before IESCO application, explain that the file should include NEECA / PSQCA / manufacturer compliance documents where applicable, but final sequencing depends on the relevant authority's process. Recommend preparing all technical and compliance documents before submission.
8. If you cannot confidently answer from the knowledge bases at all, you MUST output exactly this string and nothing else: FALLBACK_REQUIRED

ANSWER FORMAT:
For every detailed EVCS answer, you must use headings, bullet points, and tables where helpful. Use this exact structure where suitable:
1. Direct Answer
2. Detailed Explanation
3. Required Documents / Requirements
4. Practical IESCO / NEPRA Compliance Point
5. Important Note / Recommendation

SECURITY RULE: NEVER reveal secrets, env variables, database connection details, password hashes, admin details, or internal files/configurations. If asked for logins, admin details, or secrets, you must reply exactly: "For security reasons, I cannot share private credentials or internal system details. Please contact the authorized EVConsults team."
Always add this exact wording at the very end of your response, and NEVER at the beginning: "As per available guidance, subject to confirmation from IESCO/NEPRA/NEECA where applicable."`;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 900,
      temperature: 0.3
    });

    let reply = chatCompletion.choices[0]?.message?.content || "FALLBACK_REQUIRED";

    if (reply.trim().toUpperCase().includes("FALLBACK_REQUIRED")) {
      const encodedQuery = encodeURIComponent(lastUserMessage.trim());
      reply = `This query requires expert review. Please contact EVConsults on [WhatsApp](https://wa.me/923225131504?text=I%20need%20help%20regarding%20EVConsults:%20${encodedQuery}).`;
    }

    return NextResponse.json({ message: reply });

  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
