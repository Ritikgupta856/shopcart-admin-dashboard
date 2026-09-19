import PlaceholderPage from "@/components/PlaceholderPage";
import { MdBrandingWatermark } from "react-icons/md";

const Brands = () => (
  <PlaceholderPage
    title="Brands"
    description="Manage brands associated with products."
    icon={MdBrandingWatermark}
    actionLabel="+ Add Brand"
    columns={["Logo", "Brand", "Slug", "Products", "Status", "Actions"]}
    emptyTitle="No brands yet"
    emptyDescription="Brand management isn't connected to the backend yet — this page is ready for when it is."
  />
);

export default Brands;
