import { useStripe, useElements, PaymentElement, Elements, CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Form } from 'react-router-dom';
import { useCart } from '../components/CartProvider';

const stripePromise = loadStripe('pk_test_51QrZQjRsLvU29ywLCYaTBkil7DdpMb1E62Pwh7MFMI3L27zMFiY9VWLeR2wKTVhbbkS0M2ZQ0lgbARlepsanAwaz00i46qB47L');

const appearance = {
    theme: 'flat',
    variables: {
        fontFamily: ' "Gill Sans", sans-serif',
        fontLineHeight: '1.5',
        borderRadius: '5px',
        colorBackground: '#fff',
        accessibleColorOnColorPrimary: '#262626'
    },
    rules: {
        '.Block': {
            backgroundColor: 'var(--colorBackground)',
            boxShadow: 'none',
            padding: '12px'
        },
        '.Input': {
            padding: '12px'
        },
        '.Input:disabled, .Input--invalid:disabled': {
            color: 'lightgray'
        },
        '.Tab': {
            padding: '10px 12px 8px 12px',
            border: 'none'
        },
        '.Tab:hover': {
            border: 'none',
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
        },
        '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
            border: 'none',
            backgroundColor: '#fff',
            boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
        },
        '.Label': {
            fontWeight: '500'
        }
    }
};

const options = {
    layout: {
        type: 'tabs',
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: false
    },
    clientSecret: "", // To be set later
    appearance: appearance,
};

function StripePayment() {
    const [errorMsg, setErrorMsg] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const stripe = useStripe();
    const elements = useElements();
    const {BASE_URL}=useCart()

    useEffect(() => {
        async function getClientSecret(total) {
            try {
                const { data } = await axios.post(
                    `${BASE_URL}/payment/payment/create?total=${total * 100}`
                );
                console.log(data);
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.log(error);
            }
        }
        getClientSecret(100);
    }, []);

    async function paymentHandler(e) {
        e.preventDefault();
        if (!stripe || !elements || errorMsg) {
            return;
        } else {
            setProcessing(true);
            // const paymentElement = elements.getElement(PaymentElement);
            // console.log('Payment Element:', paymentElement);
            // if (!paymentElement) {
            //     setErrorMsg("Payment element is not available");
            //     setProcessing(false);

            // }

            const result = await stripe.confirmPayment({
                elements: elements.getElement(PaymentElement),
                confirmParams: {
                    return_url: 'http://localhost:5173/confirm',
                },
            });

            if (result.error) {
                console.error(result.error.message);
                setErrorMsg(result.error.message);
            } else {
                console.log('Payment confirmed!');
                setSuccess(true);
                setProcessing(false);
            }
        }
    }

    return (
        <div className='paymentCheckout'>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ ...options, clientSecret }}>
                    <form onSubmit={paymentHandler}>
                        <PaymentElement id="payment-element" options={options} />
                        {errorMsg && <div className="errorMsg">{errorMsg}</div>}
                        <button disabled={!stripe || !elements || processing || success}>
                            {processing ? 'Loading...' : 'Pay'}
                        </button>
                    </form>
                </Elements>
            )}
        </div>
    );
}

// const Payment = () => {
//     return (
//         <Elements stripe={stripePromise}>
//             <StripePayment />
//         </Elements>
//     );
// }

// export default Payment;
