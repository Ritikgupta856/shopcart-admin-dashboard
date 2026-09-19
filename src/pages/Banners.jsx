import PlaceholderPage from "@/components/PlaceholderPage";
import { MdViewCarousel } from "react-icons/md";

const Banners = () => (
  <PlaceholderPage
    title="Banners"
    description="Manage promotional banners displayed throughout the storefront."
    icon={MdViewCarousel}
    actionLabel="+ Add Banner"
    columns={["Preview", "Heading", "Position", "Start", "End", "Status", "Actions"]}
    emptyTitle="No banners yet"
    emptyDescription="Banner management isn't connected to the backend yet — this page is ready for when it is."
  />
);

export default Banners;
