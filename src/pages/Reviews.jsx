import PlaceholderPage from "@/components/PlaceholderPage";
import { MdRateReview } from "react-icons/md";

const Reviews = () => (
  <PlaceholderPage
    title="Reviews"
    description="Moderate and manage customer product reviews."
    icon={MdRateReview}
    columns={["Customer", "Product", "Rating", "Review", "Date", "Status", "Actions"]}
    emptyTitle="No reviews yet"
    emptyDescription="Customer reviews aren't connected to the backend yet — this page is ready for when it is."
  />
);

export default Reviews;
