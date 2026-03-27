import emailjs from '@emailjs/browser';

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactData): Promise<void> {
  await emailjs.send(
    import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
    import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
    {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    },
    { publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY }
  );
}
