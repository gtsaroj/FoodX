import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Product } from "../models/product.model";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  table: {
    display: "flex",
    width: "auto",
    margin: "auto",
  },
  tableRow: {
    flexDirection: "row",
    margin: "auto",
    flexWrap: "wrap",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
  },
  tableCell: {
    textAlign: "center",
  },
  footer: {
    fontSize: 12,
    marginTop: 30,
    textAlign: "center",
  },
});

interface InvoiceDocumentProp {
  orders: {
    invoiceData: {
      invoiceNumber: string;
      invoiceDate: string;
    };
    customerDetails: {
      name: string;
    };
    orderDetails: Product[];
  }[];
}

// Component for the Invoice
const InvoiceDocument: React.FC<InvoiceDocumentProp> = ({ orders }) => (
  <React.Fragment>
    <Document>
      {orders?.map((order) => (
        <Page break size="A4" style={styles.page}>
          <View>
            {/* Invoice Header */}
            <View style={styles.section}>
              <Text style={styles.header}>Invoice</Text>
              <Text>Invoice Number: {order.invoiceData.invoiceNumber}</Text>
              <Text>Date: {order.invoiceData.invoiceDate}</Text>
            </View>

            {/* Billing Information */}
            <View style={styles.section}>
              <Text style={styles.header}>Billing Information</Text>
              <Text>Company: Techspace Nepal</Text>
              <Text>Customer: {order.customerDetails.name}</Text>
              <Text>Address: Kathmandu, Nepal</Text>
            </View>

            {/* Itemized List */}
            <View style={styles.section}>
              <Text style={styles.header}>Itemized List</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCol, styles.tableCell]}>Item</Text>
                  <Text style={[styles.tableCol, styles.tableCell]}>
                    Quantity
                  </Text>
                  <Text style={[styles.tableCol, styles.tableCell]}>Price</Text>
                  <Text style={[styles.tableCol, styles.tableCell]}>Total</Text>
                </View>

                {order.orderDetails?.map((item: any, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      {item.quantity}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      ${item.price.toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCol, styles.tableCell]}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Total */}
            <View style={styles.section}>
              <Text style={styles.header}>
                Total: Rs.{" "}
                {order.orderDetails?.reduce(
                  (orderAcc, order) =>
                    orderAcc + Number(order.price) * order.quantity,
                  1
                )}
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text>Thank you for your business!</Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  </React.Fragment>
);

// Main Invoice Component
const Invoice: React.FC<InvoiceDocumentProp> = ({ orders }) => (
  <div>
    <PDFViewer showToolbar width={800} height={600}>
      <InvoiceDocument orders={orders} />
    </PDFViewer>
  </div>
);

export default Invoice;
