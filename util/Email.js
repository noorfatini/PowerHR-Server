import nodeMailer from 'nodemailer';

export default class Email {
    /** Send an email
     * @param {string} to - Email recipient
     * @param {string} subject - Email subject
     * @param {string} text - Email body
     * @returns {Promise<void>}
     * */
    static async sendEmail(to, subject, text) {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
    }
}
