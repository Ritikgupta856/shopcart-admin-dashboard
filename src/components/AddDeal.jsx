import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const emptyDeal = {
  name: "",
  ctaUrl: "/",
  bannerImage: null,
  startDate: "",
  endDate: "",
  isActive: true,
};

const AddDeal = ({ onClose, onDealAdded }) => {
  const [deal, setDeal] = useState(emptyDeal);
  const [isLoading, setIsLoading] = useState(false);

  const changeHandler = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setDeal((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setDeal((prev) => ({ ...prev, [name]: checked }));
    } else {
      setDeal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!deal.name.trim()) {
      toast.error("Deal name is required");
      return false;
    }
    if (!deal.bannerImage) {
      toast.error("Banner image is required");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", deal.bannerImage);
      formData.append("folder", "deals");
      const uploadResponse = await api.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!uploadResponse.data.success) {
        toast.error("Failed to upload banner image");
        return;
      }

      const response = await api.post("/api/deals", {
        name: deal.name.trim(),
        ctaUrl: deal.ctaUrl.trim() || "/",
        bannerImage: uploadResponse.data.image_URL,
        startDate: deal.startDate || null,
        endDate: deal.endDate || null,
        isActive: deal.isActive,
      });

      if (response.data.success) {
        toast.success("Deal added successfully");
        setDeal(emptyDeal);
        onClose();
        if (onDealAdded) onDealAdded();
      } else {
        toast.error(response.data.message || "Failed to add deal");
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
        <h2 className="text-lg font-semibold text-foreground">Add Deal</h2>
        <p className="text-sm text-text-secondary mt-1">Create a limited-time promotional deal</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1" style={{ scrollbarWidth: "none" }}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Deal Name <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={deal.name}
              onChange={changeHandler}
              disabled={isLoading}
              placeholder="Weekend Flash Sale"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="ctaUrl" className="text-sm font-medium text-foreground">
              CTA URL (where clicking the banner leads)
            </Label>
            <Input
              id="ctaUrl"
              name="ctaUrl"
              value={deal.ctaUrl}
              onChange={changeHandler}
              disabled={isLoading}
              placeholder="/category/electronics"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="bannerImage" className="text-sm font-medium text-foreground">
              Banner Image <span className="text-danger">*</span>
            </Label>
            <Input
              id="bannerImage"
              name="bannerImage"
              type="file"
              accept="image/*"
              onChange={changeHandler}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="startDate" className="text-sm font-medium text-foreground">
                Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={deal.startDate}
                onChange={changeHandler}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="endDate" className="text-sm font-medium text-foreground">
                End Date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={deal.endDate}
                onChange={changeHandler}
                disabled={isLoading}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="isActive"
              checked={deal.isActive}
              onChange={changeHandler}
              disabled={isLoading}
              className="size-4 accent-primary"
            />
            Active
          </label>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding Deal..." : "Add Deal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeal;
