import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import StripePayment from "./StripePayment";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./Checkout";
import axios from "axios";
import CheckoutForm from "./StripePayment";
import { Form } from "react-router-dom";
import { useCart } from "../components/CartProvider";
const stripePromise = loadStripe("pk_test_51QrZQjRsLvU29ywLCYaTBkil7DdpMb1E62Pwh7MFMI3L27zMFiY9VWLeR2wKTVhbbkS0M2ZQ0lgbARlepsanAwaz00i46qB47L");

function Checkout2() {
  const [clientSecret, setClientSecret] = useState("");
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

  return (
    <Elements stripe={stripePromise} options={{
      clientSecret: clientSecret
    }} >
      <Form>
        <Checkout />
      </Form>
    </Elements>
  );
}

export default Checkout2;
