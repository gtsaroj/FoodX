import React, { useState } from 'react'


export const orderData = [
    {
      orderID: "#4321",
      customer: "Saroj GT",
      Payment: "Paid",
      product: "Samosa, Momo",
      date: "2081/01/20",
      status: "Received",
    },
    {
      orderID: "#4321",
      customer: "Saroj GT",
      Payment: "Unpaid",
      product: "Samosa, Momo",
      date: "2081/01/20",
      status: "Preparing",
    },
    {
      orderID: "#4321",
      customer: "Rajan Chaudhary",
      Payment: "Paid",
      product: "Samosa, Momo",
      date: "2081/01/20",
      status: "Completed",
    },
    {
      orderID: "#4321",
      customer: "Sandesh Paudel",
      Payment: "Paid",
      product: "Samosa, Momo",
      date: "2081/01/20",
      status: "Canceled",
    },
];
  
const PaginatedData : React.FC = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [orderPerPage, setOrderPerPage] = useState(10)
 
    const lastOrderIndex = currentPage * orderPerPage;
    const firstOrderIndex = lastOrderIndex - orderPerPage;

    const currentOrders = orderData?.slice(firstOrderIndex, lastOrderIndex);

  return (
    <div>PaginatedData</div>
  )
}

export default PaginatedData