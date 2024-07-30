/* eslint-disable import/no-anonymous-default-export */
// pages/api/create-checkout-session.js

import Stripe from 'stripe';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
} else {
    getApp();
}

const firestore = getFirestore();

export default async (req, res) => {
    if (req.method === 'POST') {
        const { plan } = req.body;

        const priceId = plan === 'premium' ? 'price_1PduCxFIXur7BzE6n651JN0f' : 'price_1PduDKFIXur7BzE6vhW8B84s';

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/cancel`,
            });

            res.status(200).json({ id: session.id });
        } catch (error) {
            console.error('Error creating checkout session:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};
