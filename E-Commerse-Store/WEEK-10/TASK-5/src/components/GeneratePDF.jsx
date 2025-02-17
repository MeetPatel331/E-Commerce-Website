import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For table support
import { useCart } from './CartProvider';

export const generatePDF = () => {
    const { cart } = useCart();

    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

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
        tableRows.push([item.name, item.quantity, `$${item.price}`, `$${total}`]);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
    });

    doc.setFontSize(14);
    doc.text(`Grand Total: $${totalPrice.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

    doc.save('Invoice.pdf');
};
