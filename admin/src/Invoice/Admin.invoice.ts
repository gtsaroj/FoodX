import Papa from "papaparse";
import { Product } from "../models/product.model";
import { status } from "../models/order.model";

export interface InvoiceDocumentProp {
  orders: {
    invoiceData: {
      invoiceNumber: string;
      invoiceDate: string;
    };
    customerDetails: {
      name: string;
      phoneNumber: number;
      userId: string;
    };
    orderDetails: {
      products: Product[];
      status: status["status"];
    };
  }[];
}

export const handleDownloadCSV = ({ orders }: InvoiceDocumentProp) => {
  const csvData = orders?.map((order) => ({
    "Invoice No.": order.invoiceData.invoiceNumber,
    Date: order.invoiceData.invoiceDate,
    Name: order.customerDetails.name,
    "Phone no.": order.customerDetails.phoneNumber,
    UserId: order.customerDetails.userId,
    Products: order.orderDetails.products.map(
      (product) =>
        `• ${product.name} (Qty: ${product.quantity}, Price: Rs. ${product.price}) \n`
    ),
    Total:
      "Rs. " +
      order?.orderDetails?.products?.reduce(
        (productAcc, product) =>
          productAcc + Number(product.quantity) * Number(product.price),
        0
      ),
    Status:
      order.orderDetails.status &&
      order.orderDetails.status?.charAt(0).toUpperCase() +
        order.orderDetails.status?.slice(1),
  }));

  // Convert to CSV and trigger download

  const csv = Papa.unparse(csvData); // Convert array of objects to CSV string
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "invoice_data.csv";
  link.click();
  URL.revokeObjectURL(url);
};
