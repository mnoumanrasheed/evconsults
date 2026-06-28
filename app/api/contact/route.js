import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, phone, email, city, siteType, load, message } = body;

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

    // TEST MODE: if SMTP not configured, show success without sending
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_gmail@gmail.com') {
      console.log('⚠️  SMTP not configured — update .env.local to enable real email sending.');
      return Response.json({ success: true, mode: 'test' });
    }

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

    await transporter.sendMail({
      from: `"EVConsults Website" <${process.env.SMTP_USER}>`,
      to: 'alviaatif@hotmail.com',
      replyTo: email,
      subject: `🔋 New EV Consultation — ${name} from ${city}`,
      html,
    });

    console.log(`✅ Email sent to alviaatif@hotmail.com`);
    return Response.json({ success: true, mode: 'email' });

  } catch (err) {
    console.error('❌ Email error:', err.message);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
