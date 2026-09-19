import PlaceholderPage from "@/components/PlaceholderPage";
import { MdLocalFireDepartment } from "react-icons/md";

const Deals = () => (
  <PlaceholderPage
    title="Deals"
    description="Create and manage promotional campaigns for selected products or categories."
    icon={MdLocalFireDepartment}
    actionLabel="+ Add Deal"
    columns={["Deal", "Discount", "Scope", "Start", "End", "Status", "Actions"]}
    emptyTitle="No deals yet"
    emptyDescription="Deal management isn't connected to the backend yet — this page is ready for when it is."
  />
);

export default Deals;
