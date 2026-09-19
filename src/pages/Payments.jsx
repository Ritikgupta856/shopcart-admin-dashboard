import PlaceholderPage from "@/components/PlaceholderPage";
import { MdPayment } from "react-icons/md";

const Payments = () => (
  <PlaceholderPage
    title="Payments"
    description="Track payment transactions and payment status separately from orders."
    icon={MdPayment}
    columns={["Transaction ID", "Order", "Customer", "Amount", "Method", "Status", "Date"]}
    emptyTitle="No transactions yet"
    emptyDescription="Payment gateway transaction details aren't stored yet — this page is ready for when they are."
  />
);

export default Payments;
