import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

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
  const q = query.toLowerCase();
  
  if (q.includes('password') || q.includes('admin') || q.includes('credential') || q.includes('secret') || q.includes('login') || q.includes('env') || q.includes('db_url')) {
    return "I am not authorized to access or share administrative, internal, or credentials-related system information. If you need help with your project, please contact us at alviaatif@hotmail.com.";
  }

  if (q.includes('service') || q.includes('offer') || q.includes('do you do')) {
    return "EVConsults offers complete EV charging consultancy services in Pakistan, including:\n1. **Feasibility Study** (commercially, financially, and technically evaluating your site)\n2. **NEPRA Licensing Support** (handling all applications and compliance)\n3. **Equipment Selection** (vendor-neutral AC vs DC charger reviews)\n4. **DISCO/Utility Coordination** (load approvals and connection setup).\n\nLearn more on our [Services](/services) page.";
  }
  
  if (q.includes('license') || q.includes('licensing') || q.includes('nepra') || q.includes('register')) {
    return "We provide full support for obtaining electric vehicle charging station licenses and registrations from **NEPRA** and local distribution companies (like K-Electric, LESCO, IESCO). We manage the documentation, load audits, and compliance checks. Check out our [Licensing](/licensing) page for full details.";
  }
  
  if (q.includes('industry') || q.includes('industries') || q.includes('who do you serve') || q.includes('segment')) {
    return "We design EV charging solutions for various business segments in Pakistan, such as:\n- Petrol pumps & fuel stations\n- Housing societies & townships\n- Shopping malls & retail hubs\n- Hotels & restaurants\n- Commercial fleets & logistics\n- Motorways & highway stopovers.\n\nRead more on our [Industries](/industries) page.";
  }
  
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('address') || q.includes('reach')) {
    return "You can reach EVConsults in the following ways:\n- **Email**: alviaatif@hotmail.com\n- **Phone**: 0322 5131504 or 0332 8271005\n- **WhatsApp**: Click the floating button on the bottom right\n- **Web Form**: Submit an inquiry on our [Contact Us](/contact) page.";
  }
  
  if (q.includes('about') || q.includes('who are you') || q.includes('company')) {
    return "EVConsults is Pakistan's trusted advisory platform for EV charging infrastructure development. We assist investors, petrol pump owners, townships, and fleet operators in launching profitable and legally compliant charging stations. Check out our [About Us](/about) page.";
  }

  if (q.includes('blog') || q.includes('insight') || q.includes('news') || q.includes('article')) {
    return "We publish expert analysis, regulatory updates, and guides on our [Insights Blog](/blog). Topics include NEPRA regulations, charging station setup guides, and investment outlooks.";
  }
  
  return "Thank you for reaching out to EVConsults! We specialize in EV charging feasibility, NEPRA licensing, equipment selection, and utility coordination in Pakistan. How can we help you today? Feel free to ask about our services, licensing, industries we serve, or contact details.";
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

    // Check for sensitive keywords in user query (defense-in-depth)
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const sensitiveKeywords = [
      'password', 'credential', 'database_url', 'db_url', 'secret_key', 
      'env', 'user table', 'admin email', 'admin login', 'admin password', 
      'connection string', 'auth token', 'contact request', 'private'
    ];
    
    const containsSensitive = sensitiveKeywords.some(kw => 
      lastUserMessage.toLowerCase().includes(kw)
    );

    if (containsSensitive) {
      return NextResponse.json({
        message: "I am not authorized to access or share administrative, internal, or credentials-related system information. If you need help with your project, please contact us at alviaatif@hotmail.com."
      });
    }

    // Call OpenAI or fallback
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn("OPENAI_API_KEY is not set. Using local rule-based responder fallback.");
      const mockReply = getMockResponse(lastUserMessage);
      return NextResponse.json({ message: mockReply });
    }

    const openai = new OpenAI({ apiKey });
    
    const systemPrompt = `You are EVBot, the official friendly AI assistant of EVConsults Pakistan.
EVConsults is the leading EV charging infrastructure advisory in Pakistan.

Here is the verified PUBLIC knowledge base of EVConsults from the database:
=== KNOWLEDGE BASE ===
${knowledgeBase}
======================

INSTRUCTIONS:
1. ONLY use information from the verified KNOWLEDGE BASE above to answer questions.
2. If the user asks for something not in the knowledge base, politely say you don't have that information and suggest they contact the EVConsults team directly at alviaatif@hotmail.com or call 0322 5131504 / 0332 8271005.
3. Be professional, direct, concise, and business-friendly. Format links to pages or blogs as standard markdown link paths, like [About Us](/about), [Services](/services), [Licensing](/licensing), or [/blog/your-slug].
4. SECURITY RULE: NEVER reveal secrets, env variables, database connection details, password hashes, admin details, or internal contact requests. If asked for logins, admin details, or secrets, you must reply: "I am not authorized to access or share administrative, internal, or credentials-related system information."`;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 400,
      temperature: 0.3
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I couldn't process that request. Please contact us directly.";
    return NextResponse.json({ message: reply });

  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
