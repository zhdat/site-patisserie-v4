import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customerInfo, orderSummary } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., 'gmail' or your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
  });

  const mailOptionsCustomer = {
    from: process.env.EMAIL_USER,
    to: customerInfo.email,
    subject: "Confirmation de votre commande",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Bonjour ${customerInfo.firstName} ${customerInfo.lastName},</h2>
        <p>Merci pour votre commande ! Voici les détails :</p>
        <p>
          <strong>Commande :</strong><br>
          <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${orderSummary}</pre>
        </p>
        <p>
          <strong>Adresse de livraison :</strong><br>
          ${customerInfo.deliveryAddress}
        </p>
        <p>
          <strong>Numéro de téléphone :</strong><br>
          ${customerInfo.phoneNumber}
        </p>
        <p>
          Nous vous tiendrons informé de l'expédition de votre commande.
        </p>
        <p>
          Cordialement,<br>
          Votre Entreprise
        </p>
      </div>
    `,
  };

  const mailOptionsAdmin = {
    from: process.env.EMAIL_USER,
    to: "calliste.ravix@gmail.com",
    subject: "Nouvelle commande reçue",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Nouvelle commande reçue de ${customerInfo.firstName} ${customerInfo.lastName}</h2>
        <p>
          <strong>Détails de la commande :</strong><br>
          <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${orderSummary}</pre>
        </p>
        <p>
          <strong>Adresse de livraison :</strong><br>
          ${customerInfo.deliveryAddress}
        </p>
        <p>
          <strong>Numéro de téléphone :</strong><br>
          ${customerInfo.phoneNumber}
        </p>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptionsCustomer);
    await transporter.sendMail(mailOptionsAdmin);

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Error sending emails" });
  }
}
