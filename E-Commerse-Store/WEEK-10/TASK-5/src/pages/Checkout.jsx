import React, { useEffect, useState } from "react";
import { MdCountertops, MdDateRange, MdEmail, MdOutlineShoppingBag } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { fixingPrice } from "../components/RemovingDuplicate";
import axios from "axios";
import { useCart } from "../components/CartProvider";
import { CardElement, Elements, useElements, useStripe, CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FaAddressBook, FaCity, FaCreditCard, FaCross, FaUser } from "react-icons/fa";
import Lottie from "react-lottie";
import Confirm from '../Animations/Pay.json'
import { MusicComponent } from "../Animations/Animations";
import { TbFlagCancel } from "react-icons/tb";
import { GiCrossMark } from "react-icons/gi";

const stripePromise = loadStripe("pk_test_51QrZQjRsLvU29ywLCYaTBkil7DdpMb1E62Pwh7MFMI3L27zMFiY9VWLeR2wKTVhbbkS0M2ZQ0lgbARlepsanAwaz00i46qB47L");
const appearance = {
  theme: 'flat',
  variables: {
    fontFamily: ' "Gill Sans", sans-serif',
    fontLineHeight: '1.5',
    borderRadius: '5px',
    colorBackground: '#fff',
    accessibleColorOnColorPrimary: '#262626',
  },
  rules: {
    '.Block': {
      backgroundColor: 'var(--colorBackground)',
      boxShadow: 'none',
      padding: '12px',
    },
    '.Input': {
      padding: '12px',
    },
    '.Input:disabled, .Input--invalid:disabled': {
      color: 'lightgray',
    },
    '.Tab': {
      padding: '10px 12px 8px 12px',
      border: 'none',
    },
    '.Tab:hover': {
      border: 'none',
      boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
    },
    '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
      border: 'none',
      backgroundColor: '#fff',
      boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
    },
    '.Label': {
      fontWeight: '500',
    },
  },
};

const options = {
  clientSecret: "", // To be set later
  appearance: appearance,
};

const TotalQuantity = (cart) => {
  let c = 0;
  for (let i of cart) {
    c += parseInt(i.quantity);
  }
  return c;
};

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const { cart, total, BASE_URL } = useCart();
  const [cartData, setCart] = useState([]);
  const [totalprice, setTotal] = useState(0);
  const navigate = useNavigate();
  const stripe = useStripe();
  const [clientSecret, setClientSecret] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsg2, setErrorMsg2] = useState("");
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [info, SetInfo] = useState({
    username: '',
    email: '',
    address: '',
    city: '',
    country: ''
  })

  const [pay, SetPay] = useState({
    isNumber: false, isDate: false, isCVC: false
  })

  useEffect(() => {
    if (localStorage.getItem('admin')) {
      navigate('/')
    }
  }, [])
  useEffect(() => {
    async function getClientSecret(total) {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/payment/payment/create?total=${total * 100}`
        );
        setClientSecret(data.clientSecret);
      } catch (error) {
        setErrorMsg(error.message);
      }
    }

    if (localStorage.getItem('admin')) {
      navigate('/')
    }
    else {
      if (total !== 0) {
        getClientSecret(total);
      }
      window.scrollTo(0, 0);
      setLoading(true);
      setTimeout(() => {
        setCart(cart);
        setTotal(total);
        setLoading(false);
      }, 700);
    }
  }, [cart, total]);

  useEffect(() => {
    if (localStorage.getItem('admin')) {
      navigate('/')
    }
    else {
      setCart(cart);
      setTotal(total);
    }
  }, [cart, total]);

  async function paymentHandler(e) {
    e.preventDefault();
    if (!info.email || !info.address || !info.username || !info.city || !info.country) {
      setErrorMsg2("Provide Every Information")
      document.getElementsByClassName('errorMsg')[0].style.display = "flex"
      return
    }
    if (!pay.isCVC || !pay.isNumber || !pay.isDate) {
      setErrorMsg('Enter Card Details')
      document.getElementsByClassName('errorMsg')[0].style.display = "flex"
      setErrorMsg2('')
      return
    }
    if (!stripe || !elements) {
      console.error("Stripe or Elements not initialized");
      return;
    }
    setProcessing(true);
    await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
      },
    })
      .then(({ paymentIntent }) => {
        setErrorMsg(false);
        setSuccess(true);
        axios.post(`${BASE_URL}/order/addorder`, { userId: localStorage.getItem('userId') }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }).then((res) => {
          setProcessing(false);
          navigate("/confirm");
        }).catch((err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        setErrorMsg(error.message);
        setProcessing(false);
        setSuccess(false);
      });
  }
  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const handleChange = () => {

    elements.getElement(CardNumberElement).on('change', function (event) {
      if (event.complete) {
        SetPay({ ...pay, isNumber: true })
      }
      if (event.error) {
        SetPay({ ...pay, isNumber: false })
        setErrorMsg('Invalid Detail')
      }
    });
    elements.getElement(CardExpiryElement).on('change', function (event) {
      if (event.complete) {
        SetPay({ ...pay, isDate: true })
      }
      if (event.error) {
        SetPay({ ...pay, isDate: false })
        setErrorMsg('Invalid Date')
      }
    });
    elements.getElement(CardCvcElement).on('change', function (event) {
      if (event.complete) {
        SetPay({ ...pay, isCVC: true })
      }
      if (event.error) {
        SetPay({ ...pay, isCVC: false })
        setErrorMsg('Invalid CVC')
      }
    });
  }

  const handleInfoChange = (e) => {
    SetInfo({ ...info, [e.target.name]: e.target.value })
  }


  return (
    <div className="fullCart" style={{ marginTop: '0' }}>
      {!loading ? (
        <>
          {cartData.length === 0 ? (
            <div className="EmptyCart">
              <h1>Your Cart is empty</h1>
              <button
                onClick={() => {
                  navigate("/products");
                }}
              >
                CONTINUE SHOPPING
              </button>
              <h2>Have an Account?</h2>
              <p>
                <span onClick={() => navigate('/login')}>Log in</span> to check faster
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  borderBottom: "1px solid lightgray",
                }}
              >
                <div className="header">
                  <h2 onClick={() => navigate('/')}>South Texas Slings</h2>
                  <button onClick={() => navigate('/cart')}>
                    <MdOutlineShoppingBag />
                  </button>
                </div>
              </div>
              <div className="checkout">
                <div className="payment">
                  <div className="paymentCheckout">
                    <form action="" onSubmit={paymentHandler} className="payment-form">
                      <div className='form-container'>
                        <div className="field field-number">
                          <label htmlFor="cardNumber">  <div>Email</div>
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={(e) => handleInfoChange(e)}
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="cardExpiry"> Name</label>
                          <input
                            type="text"
                            name="username"
                            placeholder="Name"
                            onChange={(e) => handleInfoChange(e)}
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="cardCvc"> <div>Address</div> </label>
                          <input
                            type="text"
                            name="address"
                            onChange={(e) => handleInfoChange(e)}
                            placeholder="Address"
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="cardCvc"> <div>City</div></label>
                          <input
                            type="text"
                            name="city"
                            onChange={(e) => handleInfoChange(e)}
                            placeholder="City"
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="cardCvc"> <div>Country</div></label>
                          <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            onChange={(e) => handleInfoChange(e)}
                          />
                        </div>
                        {errorMsg2 && <div className="errorMsg" style={{
                        }}>{errorMsg2}&nbsp;<button><GiCrossMark onClick={() => {
                          document.getElementsByClassName('errorMsg')[0].style.display = "none"
                        }} /></button></div>}
                      </div>
                      <div style={{
                        display: 'flex',
                      }}>
                        <MusicComponent />
                        <h3>Payment Details</h3>
                      </div>
                      <div className='form-container'>
                        <div className="field field-number">
                          <label htmlFor="cardNumber"><div>Card Number</div>&nbsp;<div>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                              <path fill="#1565C0" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"></path><path fill="#FFF" d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"></path><path fill="#FFC107" d="M12.212,24.945l-0.966-4.748c0,0-0.437-1.029-1.573-1.029c-1.136,0-4.44,0-4.44,0S10.894,20.84,12.212,24.945z"></path>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                              <linearGradient id="NgmlaCv2fU27PJOuiUvQVa_Sq0VNi1Afgmj_gr1" x1="20.375" x2="28.748" y1="1365.061" y2="1394.946" gradientTransform="translate(0 -1354)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00b3ee"></stop><stop offset="1" stop-color="#0082d8"></stop></linearGradient><path fill="url(#NgmlaCv2fU27PJOuiUvQVa_Sq0VNi1Afgmj_gr1)" d="M43.125,9H4.875C3.287,9,2,10.287,2,11.875v24.25C2,37.713,3.287,39,4.875,39h38.25	C44.713,39,46,37.713,46,36.125v-24.25C46,10.287,44.713,9,43.125,9z"></path><circle cx="17.053" cy="24.053" r="10.053" fill="#cf1928"></circle><linearGradient id="NgmlaCv2fU27PJOuiUvQVb_Sq0VNi1Afgmj_gr2" x1="20" x2="40.107" y1="24.053" y2="24.053" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fede00"></stop><stop offset="1" stop-color="#ffd000"></stop></linearGradient><circle cx="30.053" cy="24.053" r="10.053" fill="url(#NgmlaCv2fU27PJOuiUvQVb_Sq0VNi1Afgmj_gr2)"></circle><path fill="#d97218" d="M20,24.053c0,3.072,1.382,5.818,3.553,7.662c2.172-1.844,3.553-4.59,3.553-7.662	s-1.382-5.818-3.553-7.662C21.382,18.235,20,20.981,20,24.053z"></path>
                            </svg>

                          </div></label>
                          <CardNumberElement id="cardNumber" onChange={handleChange} options={cardStyle} className="input-element" />
                        </div>
                        <div className="field">
                          <label htmlFor="cardExpiry">Expiration Date&nbsp;<MdDateRange className="icon" /> </label>
                          <CardExpiryElement id="cardExpiry" onChange={handleChange} options={cardStyle} className="input-element" />
                        </div>
                        <div className="field">
                          <label htmlFor="cardCvc"><div>CVV</div><div style={{ color: 'blue' }}>***</div></label>
                          <CardCvcElement id="cardCvc" onChange={handleChange} options={cardStyle} className="input-element" />
                        </div>
                        {errorMsg && <div className="errorMsg" style={{
                          color: 'red', textAlign: 'left', marginTop: '15px'
                        }}>{errorMsg}</div>}
                        <button onClick={(event) => paymentHandler(event)} type="submit" className="btnpay" disabled={!stripe || !elements || processing || success}>
                          {processing ? <div className="loader"></div> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            PAY
                          </div>}
                        </button>
                      </div>
                      <div>
                        <ul className="links">
                          <li>
                            <Link>Refund Policy</Link>
                          </li>
                          <li>
                            <Link>Shipping Policy</Link>
                          </li>
                          <li>
                            <Link>Privacy Policy</Link>
                          </li>
                          <li>
                            <Link>Terms of Service</Link>
                          </li>
                          <li>
                            <Link>Contact Information</Link>
                          </li>
                        </ul>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="products">
                  <h3>Overview</h3>
                  <div className="cartproducts">
                    {cartData &&
                      cartData.map((item, index) => {
                        return (
                          <div key={index}>
                            <img src={item.image} width={40} height={40} alt="" />
                            <p>
                              {String(item.title).slice(0, 65).concat('...')} <br />{" "}
                              <span style={{ color: "gray" }}>{item.color}</span>
                            </p>
                            <p>${fixingPrice(item.price)}</p>
                          </div>
                        );
                      })}
                  </div>
                  <div className="discounts">
                    <div className="items">
                      <div>
                        <p>SubTotal : {TotalQuantity(cartData ? cartData : [])} items</p>
                        <p>$ {fixingPrice(totalprice)}</p>
                      </div>
                      <div style={{ color: "#A97A5B" }}>
                        <h3>Total</h3>
                        <h3>USD ${fixingPrice(totalprice)}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{ display: 'grid', placeContent: 'center', height: '100vh' }}>
          <div className="loader" style={{ background: 'hsl(204, 77%, 39%)' }}></div>
        </div>
      )}
    </div>
  );
};

const Payment = () => {

  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
};

export default Payment;