/* eslint-disable import/no-anonymous-default-export */
// pages/api/stripe-webhook.js
import { buffer } from 'micro';
import * as admin from 'firebase-admin';
import sendEmail from '../../utils/sendEmail';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const firestore = admin.firestore();

export const config = {
    api: {
        bodyParser: false,
    },
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;

        try {
        event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
        } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
        }

        if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const email = session.customer_details.email;
        const plan = session.display_items[0].plan.id; // Update this as necessary
        const userId = session.client_reference_id; // Assuming you pass user ID in the session creation

        // Update user in Firebase
        const userRef = firestore.collection('users').doc(userId);
        await userRef.update({
            subscription: {
            status: 'active',
            plan,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
        });

        // Send confirmation email
        const subject = 'Confirmation de votre abonnement';
        const text = `Bonjour,

        Merci de vous être abonné au plan ${plan}. Votre abonnement est maintenant actif et sera valable jusqu'au ${new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}.

        Cordialement,
        L'équipe TCG Market Value`;

        await sendEmail(email, subject, text);
        }

        res.status(200).send('Success');
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};
