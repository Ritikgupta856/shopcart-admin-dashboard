import PlaceholderPage from "@/components/PlaceholderPage";
import { MdLocalOffer } from "react-icons/md";

const Coupons = () => (
  <PlaceholderPage
    title="Coupons"
    description="Create and manage discount codes with controlled usage rules."
    icon={MdLocalOffer}
    actionLabel="+ Add Coupon"
    columns={["Code", "Discount", "Min. Order", "Usage", "Expiry", "Status", "Actions"]}
    emptyTitle="No coupons yet"
    emptyDescription="Coupon management isn't connected to the backend yet — this page is ready for when it is."
  />
);

export default Coupons;
