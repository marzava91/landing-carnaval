import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { to, subject, body } = req.body;

    // Validación: Asegurarse de que los parámetros obligatorios estén presentes
    if (!to || !subject || !body) {
        return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
    }
    
    // Configura las credenciales del servidor SMTP de Gmail
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'trujillo.es.carnaval@gmail.com', // Tu correo electrónico
        pass: 'odtl bikt givy pjna', // Contraseña de aplicación (NO tu contraseña normal)
      },
    });

    // Configura el correo
    const mailOptions = {
        from: '"Trujillo es Carnaval" <trujillo.es.carnaval@gmail.com>', // Remitente
        to: to, // Destinatario(s)
        subject: subject, // Asunto
        html: body, // Contenido HTML
    };

    try {
      // Enviar el correo
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ error: 'Error al enviar el correo' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
