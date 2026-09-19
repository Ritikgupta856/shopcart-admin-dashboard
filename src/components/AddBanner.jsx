import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const emptyBanner = {
  title: "",
  ctaUrl: "/",
  desktopImage: null,
  mobileImage: null,
  startDate: "",
  endDate: "",
  displayOrder: "0",
  isActive: true,
};

const AddBanner = ({ onClose, onBannerAdded }) => {
  const [banner, setBanner] = useState(emptyBanner);
  const [isLoading, setIsLoading] = useState(false);

  const changeHandler = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setBanner((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setBanner((prev) => ({ ...prev, [name]: checked }));
    } else {
      setBanner((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!banner.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!banner.desktopImage) {
      toast.error("Desktop image is required");
      return false;
    }
    return true;
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "banners");
    const response = await api.post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!response.data.success) throw new Error("Upload failed");
    return response.data.image_URL;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const desktopImageUrl = await uploadImage(banner.desktopImage);
      const mobileImageUrl = banner.mobileImage ? await uploadImage(banner.mobileImage) : "";

      const response = await api.post("/api/banners", {
        title: banner.title.trim(),
        ctaUrl: banner.ctaUrl.trim() || "/",
        desktopImage: desktopImageUrl,
        mobileImage: mobileImageUrl,
        startDate: banner.startDate || null,
        endDate: banner.endDate || null,
        displayOrder: Number(banner.displayOrder) || 0,
        isActive: banner.isActive,
      });

      if (response.data.success) {
        toast.success("Banner added successfully");
        setBanner(emptyBanner);
        onClose();
        if (onBannerAdded) onBannerAdded();
      } else {
        toast.error(response.data.message || "Failed to add banner");
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
        <h2 className="text-lg font-semibold text-foreground">Add Banner</h2>
        <p className="text-sm text-text-secondary mt-1">Create a new homepage hero banner</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1" style={{ scrollbarWidth: "none" }}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Title <span className="text-danger">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={banner.title}
              onChange={changeHandler}
              disabled={isLoading}
              placeholder="Power Up Your World"
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
              value={banner.ctaUrl}
              onChange={changeHandler}
              disabled={isLoading}
              placeholder="/category/electronics"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="desktopImage" className="text-sm font-medium text-foreground">
              Desktop Image <span className="text-danger">*</span>
            </Label>
            <Input
              id="desktopImage"
              name="desktopImage"
              type="file"
              accept="image/*"
              onChange={changeHandler}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="mobileImage" className="text-sm font-medium text-foreground">
              Mobile Image (optional)
            </Label>
            <Input
              id="mobileImage"
              name="mobileImage"
              type="file"
              accept="image/*"
              onChange={changeHandler}
              disabled={isLoading}
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
                value={banner.startDate}
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
                value={banner.endDate}
                onChange={changeHandler}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="space-y-3">
              <Label htmlFor="displayOrder" className="text-sm font-medium text-foreground">
                Display Order
              </Label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                value={banner.displayOrder}
                onChange={changeHandler}
                disabled={isLoading}
                min="0"
              />
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="isActive"
                checked={banner.isActive}
                onChange={changeHandler}
                disabled={isLoading}
                className="size-4 accent-primary"
              />
              Active
            </label>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding Banner..." : "Add Banner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBanner;
