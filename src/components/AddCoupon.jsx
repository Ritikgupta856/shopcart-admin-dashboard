import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const emptyCoupon = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderValue: "0",
  maxDiscount: "",
  expiryDate: "",
  isActive: true,
};

const AddCoupon = ({ onClose, onCouponAdded }) => {
  const [coupon, setCoupon] = useState(emptyCoupon);
  const [isLoading, setIsLoading] = useState(false);

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setCoupon((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validateForm = () => {
    if (!coupon.code.trim()) {
      toast.error("Coupon code is required");
      return false;
    }
    if (!coupon.discountValue || isNaN(coupon.discountValue) || Number(coupon.discountValue) <= 0) {
      toast.error("Valid discount value is required");
      return false;
    }
    if (coupon.discountType === "percentage" && Number(coupon.discountValue) > 100) {
      toast.error("Percentage discount cannot exceed 100");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await api.post("/api/coupons", {
        code: coupon.code.trim(),
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        minOrderValue: Number(coupon.minOrderValue) || 0,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
        expiryDate: coupon.expiryDate || null,
        isActive: coupon.isActive,
      });

      if (response.data.success) {
        toast.success("Coupon added successfully");
        setCoupon(emptyCoupon);
        onClose();
        if (onCouponAdded) onCouponAdded();
      } else {
        toast.error(response.data.message || "Failed to add coupon");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-foreground">Add Coupon</h2>
        <p className="text-sm text-text-secondary mt-1">Create a discount code for customers</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1" style={{ scrollbarWidth: "none" }}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="code" className="text-sm font-medium text-foreground">
              Coupon Code <span className="text-danger">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              value={coupon.code}
              onChange={changeHandler}
              disabled={isLoading}
              placeholder="SAVE20"
              className="uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="discountType" className="text-sm font-medium text-foreground">
                Discount Type
              </Label>
              <select
                id="discountType"
                name="discountType"
                value={coupon.discountType}
                onChange={changeHandler}
                disabled={isLoading}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="discountValue" className="text-sm font-medium text-foreground">
                Discount Value <span className="text-danger">*</span>
              </Label>
              <Input
                id="discountValue"
                name="discountValue"
                type="number"
                value={coupon.discountValue}
                onChange={changeHandler}
                disabled={isLoading}
                placeholder={coupon.discountType === "percentage" ? "20" : "200"}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="minOrderValue" className="text-sm font-medium text-foreground">
                Min. Order Value
              </Label>
              <Input
                id="minOrderValue"
                name="minOrderValue"
                type="number"
                value={coupon.minOrderValue}
                onChange={changeHandler}
                disabled={isLoading}
                min="0"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="maxDiscount" className="text-sm font-medium text-foreground">
                Max Discount (optional)
              </Label>
              <Input
                id="maxDiscount"
                name="maxDiscount"
                type="number"
                value={coupon.maxDiscount}
                onChange={changeHandler}
                disabled={isLoading}
                placeholder="Cap for % discounts"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="expiryDate" className="text-sm font-medium text-foreground">
              Expiry Date (optional)
            </Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={coupon.expiryDate}
              onChange={changeHandler}
              disabled={isLoading}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="isActive"
              checked={coupon.isActive}
              onChange={changeHandler}
              disabled={isLoading}
              className="size-4 accent-primary"
            />
            Active
          </label>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding Coupon..." : "Add Coupon"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;
