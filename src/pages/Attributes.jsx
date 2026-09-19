import PlaceholderPage from "@/components/PlaceholderPage";
import { MdTune } from "react-icons/md";

const Attributes = () => (
  <PlaceholderPage
    title="Attributes"
    description="Manage reusable product attributes, variants and specifications."
    icon={MdTune}
    actionLabel="+ Add Attribute"
    columns={["Attribute", "Type", "Values", "Category", "Required", "Actions"]}
    emptyTitle="No attributes yet"
    emptyDescription="Attributes (size, color, material, warranty, etc.) aren't connected to the backend yet."
  />
);

export default Attributes;
