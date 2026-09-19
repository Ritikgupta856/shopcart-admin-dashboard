import PlaceholderPage from "@/components/PlaceholderPage";
import { MdDescription } from "react-icons/md";

const Reports = () => (
  <PlaceholderPage
    title="Reports"
    description="Generate structured business reports that can be filtered and exported."
    icon={MdDescription}
    actionLabel="+ Generate Report"
    columns={["Report", "Type", "Date Range", "Generated On", "Format", "Actions"]}
    emptyTitle="No reports generated yet"
    emptyDescription="CSV/Excel/PDF export isn't connected to the backend yet — this page is ready for when it is."
  />
);

export default Reports;
