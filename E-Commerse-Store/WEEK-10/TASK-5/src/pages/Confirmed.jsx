import React, { useEffect, useState } from 'react'
import img from '../images/check-symbol-4794.png'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import { useCart } from '../components/CartProvider';
import Confirm from '../Animations/Confirmed.json'
import Lottie from 'react-lottie'
import { FaDownload } from 'react-icons/fa';
import { fixingPrice } from '../components/RemovingDuplicate';

export const generatePDF = (cart) => {
    console.log(cart)
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invoice / Bill', 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableColumn = ['Product Name', 'Quantity', 'Price', 'Total'];
    const tableRows = [];

    let totalPrice = 0;

    cart.forEach((item) => {
        const total = item.quantity * item.price;
        totalPrice += total;
        tableRows.push([item.title, item.quantity, `$${fixingPrice(item.price)}`, `$${fixingPrice(total)}`]);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
    });

    doc.setFontSize(14);
    doc.text(`Total: $${totalPrice.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
    doc.save('Invoice.pdf');
}

const Confirmed = () => {
    const navigate = useNavigate()
    const { cart, logout } = useCart()
    const [cartData, setCartData] = useState([])
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: Confirm,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0)
        setCartData(cart)
        logout()
    }, [])
    return (
        <div style={{
            display: 'grid', height: '100vh', placeContent: 'center', textAlign: 'center'
        }}>
            <div className='confirm'>
                {/* <img src={img} alt="" /> */}
                <Lottie
                    options={defaultOptions}
                    height={300}
                    width={400}
                />
                <h1>Your Order is Confirmed</h1>
                <button className='download' onClick={() => generatePDF(cartData)}><FaDownload /></button>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        </div>
    )
}

export default Confirmed