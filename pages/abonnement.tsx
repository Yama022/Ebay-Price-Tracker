import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Header from '../components/Header';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const Abonnement: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState('');

    const handlePlanSelection = (plan: string) => {
        setSelectedPlan(plan);
    };

    const handlePayment = async () => {
        if (selectedPlan) {
        const stripe = await stripePromise;
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ plan: selectedPlan }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Payment Error:', error);
            return;
        }

        const session = await response.json();
        const result = await stripe?.redirectToCheckout({
            sessionId: session.id,
        });

        if (result?.error) {
            console.error(result.error);
        }
        }
    };

    return (
        <div>
        <Header />
        <h1>Choisissez votre abonnement</h1>
        <div>
            <input
            type="radio"
            id="premium"
            name="abonnement"
            value="premium"
            checked={selectedPlan === 'premium'}
            onChange={() => handlePlanSelection('premium')}
            />
            <label htmlFor="premium">Premium - 9,99€/an</label>
        </div>
        <div>
            <input
            type="radio"
            id="vip"
            name="abonnement"
            value="vip"
            checked={selectedPlan === 'vip'}
            onChange={() => handlePlanSelection('vip')}
            />
            <label htmlFor="vip">VIP - 19,99€/an</label>
        </div>
        <button onClick={handlePayment}>Payer</button>
        </div>
    );
};

export default Abonnement;
