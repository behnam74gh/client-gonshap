import React from "react";
import { Document, Page, Text, StyleSheet, Font } from "@react-pdf/renderer";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  DataTableCell,
} from "@david.kucsai/react-pdf-table";

Font.register({
  family: "vazir",
  src: "../../assets/fonts/Vazir-FD.woff",
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "vazir",
    display: "flex",
    flexFlow: "column wrap",
    textAlign: "right",
  },
  title: {
    fontSize: "18px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    textAlign: "center",
    margin: "10px 0",
  },
  tHead: {
    textAlign: "center",
    fontSize: "10px",
    padding: "5px",
    backgroundColor: "black",
    color: "white",
  },
  center: {
    textAlign: "center",
    fontSize: "10px",
    padding: "5px",
  },
  infoWrapper: {
    width: "100%",
    margin: "14px",
    fontSize: "12px",
    display: "flex",
    flexFlow: "column wrap",
    textAlign: "right",
  },
  infoBox: {
    width: "100%",
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "9px",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: "12px",
    marginBottom: "20px",
    textAlign: "center",
    color: "grey",
  },
  footer: {
    padding: "100px",
    fontSize: "10px",
    marginBottom: "10px",
    textAlign: "center",
    color: "grey",
  },
});

const Invoice = ({ order }) => (
  <Document>
    <Page style={styles.body} size="A4">
      <Text style={styles.title}>خلاصه سفارش</Text>
      <Text style={styles.subtitle}>مجموعه گُنشاپ</Text>

      {order.shippingAddress && (
        <Text style={styles.infoWrapper}>
          <Text style={styles.infoBox}>
            {order.shippingAddress.fullName}
            {"  "}
            خریدار :
          </Text>
          {"\n"}
          <Text style={styles.infoBox}>
            {order.shippingAddress.address}
            {"  "}
            آدرس :
          </Text>
          {"\n"}
          <Text style={styles.infoBox}>
            {order.shippingAddress.phoneNumber}
            {"  "}
            شماره موبایل :
          </Text>
          {"\n"}
        </Text>
      )}
      <Text style={styles.center}>فهرست محصولات خریداری شده</Text>
      <Table>
        <TableHeader>
          <TableCell style={styles.tHead}>رنگ ها</TableCell>
          <TableCell style={styles.tHead}>تعداد</TableCell>
          <TableCell style={styles.tHead}>قیمت نهایی</TableCell>
          <TableCell style={styles.tHead}>عنوان</TableCell>
        </TableHeader>
      </Table>
      <Table data={order.products}>
        <TableBody>
          <DataTableCell
            style={styles.center}
            getContent={(x) => x.colors[0].colorName}
          />
          <DataTableCell style={styles.center} getContent={(x) => x.count} />
          <DataTableCell style={styles.center} getContent={(x) => x.price} />

          <DataTableCell
            style={styles.center}
            getContent={(x) => x.product.title}
          />
        </TableBody>
      </Table>

      <Text style={styles.infoWrapper}>
        <Text style={styles.infoBox}>
          {new Date(order.createdAt)
            .toLocaleDateString("fa")
            .split("")
            .reverse()
            .join("")}
          {"  "},{"  "}
          {new Date(order.createdAt)
            .toLocaleTimeString("fa")
            .split("")
            .reverse()
            .join("")}
          {"  "}
          زمان ثبت سفارش :
        </Text>
        {"\n"}
        <Text style={styles.infoBox}>
          {order.orderStatus === 0
            ? "نیاز به تایید مدیریت دارد"
            : order.orderStatus === 1
            ? "تایید شده است"
            : order.orderStatus === 2
            ? "کامل شده است"
            : order.orderStatus === 3
            ? "لغو شده است"
            : "رد شده است"}
          {"  "}
          وضعیت سفارش :
        </Text>
        {"\n"}
        <Text style={styles.infoBox}>
          {order.deliveryStatus === 0
            ? "ارسال نشده است"
            : order.deliveryStatus === 1
            ? "ارسال شده است"
            : order.deliveryStatus === 2
            ? "تحویل داده شد"
            : "برگشت داده شد"}
          {"  "}
          وضعیت ارسال :
        </Text>
        {"\n"}
        {order.deliveredAt && (
          <Text style={styles.infoBox}>
            {new Date(order.deliveredAt)
              .toLocaleDateString("fa")
              .split("")
              .reverse()
              .join("")}
            {"  "},{"  "}
            {new Date(order.deliveredAt)
              .toLocaleTimeString("fa")
              .split("")
              .reverse()
              .join("")}
            {"  "}
            زمان تحویل :
          </Text>
        )}
        {order.deliveredAt && "\n"}
        <Text style={styles.infoBox}>
          {order.isPaid ? "پرداخت شده است" : "پرداخت نشده است"}
          {"  "}
          وضعیت پرداخت :
        </Text>
        {"\n"}
        {order.paidAt && (
          <Text style={styles.infoBox}>
            {new Date(order.paidAt)
              .toLocaleDateString("fa")
              .split("")
              .reverse()
              .join("")}
            {"  "},{"  "}
            {new Date(order.paidAt)
              .toLocaleTimeString("fa")
              .split("")
              .reverse()
              .join("")}
            {"  "}
            زمان پرداخت :
          </Text>
        )}
        {order.paidAt && "\n"}
        <Text style={styles.infoBox}>
          تومان{" "}
          {order.paymentInfo &&
            order.paymentInfo.amount
              .toLocaleString("fa")
              .split("")
              .reverse()
              .join("")}
          {"  "}
          هزینه کلی سفارش :
        </Text>
        {"\n"}
        <Text style={styles.infoBox}>
          {order._id}
          {"  "}
          شماره سریال سفارش :
        </Text>
      </Text>
      <Text style={styles.footer}>
        ~ بابت اعتماد و خرید شما از گُنشاپ ، متشکریم ~
      </Text>
    </Page>
  </Document>
);

export default Invoice;
