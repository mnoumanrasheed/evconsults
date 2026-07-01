'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { contactSchema } from '@/lib/validations';
import nodemailer from 'nodemailer';

async function getContactEmail() {
  try {
    const setting = await prisma.globalSetting.findUnique({ where: { key: 'contact' } });
    return setting?.value?.email || 'alviaatif@hotmail.com';
  } catch {
    return 'alviaatif@hotmail.com';
  }
}

// ─── Save contact request (called from contact form) ─────
export async function saveContactRequest(data) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    const request = await prisma.contactRequest.create({
      data: parsed.data,
    });

    const { name, company, phone, email, city, siteType, load, message } = parsed.data;

    // Always log to terminal (visible in npm run dev console)
    console.log('\n📧 ====== NEW CONSULTATION REQUEST ======');
    console.log(`Name:    ${name}`);
    console.log(`Company: ${company || '—'}`);
    console.log(`Phone:   ${phone}`);
    console.log(`Email:   ${email}`);
    console.log(`City:    ${city}`);
    console.log(`Site:    ${siteType}`);
    console.log(`Load:    ${load || '—'}`);
    console.log(`Message: ${message}`);
    console.log('=========================================\n');

    // Send email using Nodemailer if SMTP is configured
    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your_gmail@gmail.com') {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#040D1A,#0B1F33);padding:32px 28px;text-align:center">
              <h1 style="color:#39D353;margin:0;font-size:1.6rem;letter-spacing:-0.02em">⚡ EVConsults</h1>
              <p style="color:rgba(255,255,255,0.55);margin:8px 0 0;font-size:0.88rem">New Consultation Request Received</p>
            </div>
            <div style="padding:28px;background:white">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;color:#666;font-size:0.85rem;width:140px">Full Name</td><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;font-weight:600;color:#0B1F33">${name}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;color:#666;font-size:0.85rem">Company</td><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;font-weight:600;color:#0B1F33">${company || '—'}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;color:#666;font-size:0.85rem">Phone</td><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;font-weight:600;color:#0B1F33">${phone}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;color:#666;font-size:0.85rem">Email</td><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;font-weight:600;color:#0B1F33">${email}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;color:#666;font-size:0.85rem">City</td><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;font-weight:600;color:#0B1F33">${city}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;color:#666;font-size:0.85rem">Site Type</td><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;font-weight:600;color:#0B1F33">${siteType}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;color:#666;font-size:0.85rem">Available Load</td><td style="padding:10px 0;border-bottom:1px solid #EEF1F5;font-weight:600;color:#0B1F33">${load || '—'}</td></tr>
              </table>
              <div style="margin-top:20px;padding:16px;background:#F8FAFC;border-radius:8px;border-left:3px solid #39D353">
                <p style="margin:0 0 6px;color:#888;font-size:0.8rem;text-transform:uppercase;letter-spacing:1px">Message</p>
                <p style="margin:0;color:#0B1F33;line-height:1.65">${message}</p>
              </div>
            </div>
            <div style="padding:14px 28px;background:#F8FAFC;text-align:center;border-top:1px solid #EEF1F5">
              <p style="margin:0;font-size:0.75rem;color:#94a3b8">EVConsults — Pakistan's EV Charging Advisory Platform | evconsults.pk</p>
            </div>
          </div>
        `;

        const notifyEmail = await getContactEmail();

        await transporter.sendMail({
          from: `"EVConsults Website" <${process.env.SMTP_USER}>`,
          to: notifyEmail,
          replyTo: email,
          subject: `🔋 New EV Consultation — ${name} from ${city}`,
          html,
        });

        console.log(`✅ Email sent to ${notifyEmail}`);
      } catch (emailErr) {
        console.error('❌ Email error:', emailErr.message);
      }
    }

    return { success: true, id: request.id };
  } catch (err) {
    console.error('[saveContactRequest]', err);
    return { error: 'Failed to save contact request' };
  }
}

// ─── List all contact requests (admin) ───────────────────
export async function listContactRequests() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return [];

  return prisma.contactRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// ─── Update contact request status (admin) ───────────────
export async function updateContactStatus(id, status) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const validStatuses = ['NEW', 'READ', 'RESPONDED'];
  if (!validStatuses.includes(status)) return { error: 'Invalid status' };

  try {
    await prisma.contactRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/contact-requests');
    return { success: true };
  } catch (err) {
    console.error('[updateContactStatus]', err);
    return { error: 'Failed to update status' };
  }
}

// ─── Delete contact request (admin) ──────────────────────
export async function deleteContactRequest(id) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return { error: 'Unauthorized' };

  try {
    await prisma.contactRequest.delete({ where: { id } });
    revalidatePath('/admin/contact-requests');
    return { success: true };
  } catch (err) {
    console.error('[deleteContactRequest]', err);
    return { error: 'Failed to delete request' };
  }
}

// ─── Get contact request counts by status (dashboard) ────
export async function getContactCounts() {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') return {};

  const counts = await prisma.contactRequest.groupBy({
    by: ['status'],
    _count: true,
  });

  return counts.reduce((acc, cur) => {
    acc[cur.status] = cur._count;
    return acc;
  }, {});
}
