const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        // Warning: This requires EMAIL_USER and EMAIL_PASS to be set in .env
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("Email service Warning: Missing EMAIL_USER or EMAIL_PASS in .env. Skipping email dispatch.");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `Brunati Perfumes <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email successfully routed to ${options.email}`);
    } catch (error) {
        console.error("Error dispatching email sequence:", error.message);
    }
};

module.exports = sendEmail;
