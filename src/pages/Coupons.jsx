import { useContext, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppContext } from "@/Context/AppContext";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Heading from "../components/Heading";
import EmptyState from "@/components/EmptyState";
import AddCoupon from "../components/AddCoupon";
import { MdOutlineClose, MdLocalOffer } from "react-icons/md";

const Coupons = () => {
  const { coupons, getCoupons } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const removeCoupon = async () => {
    if (!couponToDelete) return;
    setIsLoading(true);
    try {
      await api.delete(`/api/coupons/${couponToDelete._id}`);
      toast.success("Coupon removed successfully");
      setCouponToDelete(null);
      getCoupons();
    } catch (error) {
      toast.error("Error removing coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDiscount = (coupon) =>
    coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`;

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title="Coupons"
        description="Create and manage discount codes for customers."
        actions={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto">+ Add Coupon</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96">
              <AddCoupon onClose={() => setOpen(false)} onCouponAdded={() => getCoupons()} />
            </SheetContent>
          </Sheet>
        }
      />

      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Min. Order</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <EmptyState icon={MdLocalOffer} title="No coupons yet" description="Add your first discount code to get started." />
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon._id} className="hover:bg-secondary/60">
                  <TableCell className="font-medium text-sm text-foreground">{coupon.code}</TableCell>
                  <TableCell className="text-sm text-text-secondary">{formatDiscount(coupon)}</TableCell>
                  <TableCell className="text-sm text-text-secondary">₹{coupon.minOrderValue}</TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "No expiry"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.isActive ? "success" : "secondary"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCouponToDelete(coupon)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger-bg"
                    >
                      <MdOutlineClose className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={couponToDelete !== null} onOpenChange={(o) => !o && setCouponToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{couponToDelete?.code}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeCoupon} disabled={isLoading} className="bg-danger text-white hover:bg-danger/90">
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Coupons;
