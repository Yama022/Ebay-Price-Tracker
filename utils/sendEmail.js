// utils/sendEmail.js
import emailjs from 'emailjs-com';

const sendEmail = async (to, subject, text) => {
    const templateParams = {
        to_email: to,
        subject,
        message: text,
    };

    try {
        const response = await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.EMAILJS_USER_ID
        );
        console.log('Email sent successfully:', response.status, response.text);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

export default sendEmail;
