import { useContext, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppContext } from "@/Context/AppContext";
import Heading from "../components/Heading";
import EmptyState from "@/components/EmptyState";
import { MdRateReview, MdCheck, MdClose, MdDeleteOutline } from "react-icons/md";

const statusVariant = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const Reviews = () => {
  const { reviews, getReviews } = useContext(AppContext);
  const [busyId, setBusyId] = useState(null);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await api.patch(`/api/reviews/${id}/status`, { status });
      toast.success(`Review ${status}`);
      getReviews();
    } catch (error) {
      toast.error("Failed to update review");
    } finally {
      setBusyId(null);
    }
  };

  const removeReview = async (id) => {
    setBusyId(id);
    try {
      await api.delete(`/api/reviews/${id}`);
      toast.success("Review deleted");
      getReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title="Reviews"
        description="Moderate and manage customer product reviews."
      />

      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <EmptyState icon={MdRateReview} title="No reviews yet" description="Customer reviews will show up here once submitted." />
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review._id} className="hover:bg-secondary/60">
                  <TableCell className="text-sm text-foreground">{review.user?.fullname}</TableCell>
                  <TableCell className="text-sm text-text-secondary">{review.product?.name}</TableCell>
                  <TableCell className="text-sm text-foreground">{review.rating} ★</TableCell>
                  <TableCell className="text-sm text-text-secondary max-w-xs truncate">{review.text || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[review.status]} className="capitalize">
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {review.status !== "approved" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busyId === review._id}
                          onClick={() => updateStatus(review._id, "approved")}
                          className="h-8 w-8 p-0 text-success hover:bg-success-bg"
                        >
                          <MdCheck className="h-4 w-4" />
                        </Button>
                      )}
                      {review.status !== "rejected" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busyId === review._id}
                          onClick={() => updateStatus(review._id, "rejected")}
                          className="h-8 w-8 p-0 text-warning hover:bg-warning-bg"
                        >
                          <MdClose className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busyId === review._id}
                        onClick={() => removeReview(review._id)}
                        className="h-8 w-8 p-0 text-danger hover:bg-danger-bg"
                      >
                        <MdDeleteOutline className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Reviews;
