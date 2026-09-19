import { useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const EditCategory = ({ category: existing, onClose, onCategoryUpdated }) => {
  const [category, setCategory] = useState({
    name: existing.name,
    slug: existing.slug,
    image: null,
    existingImageUrl: existing.image,
    shortDescription: existing.shortDescription || "",
    displayOrder: String(existing.displayOrder ?? 0),
    isActive: existing.isActive !== false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCategory((prev) => ({ ...prev, image: file }));
    } else {
      toast.error("Please upload an image file");
    }
  }, []);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const changeHandler = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image") {
      setCategory({ ...category, image: files[0] });
    } else if (name === "name") {
      const newSlug = generateSlug(value);
      setCategory({ ...category, name: value, slug: newSlug });
    } else if (type === "checkbox") {
      setCategory({ ...category, [name]: checked });
    } else {
      setCategory({ ...category, [name]: value });
    }
  };

  const validateForm = () => {
    if (!category.name.trim()) {
      toast.error("Category name is required");
      return false;
    }
    if (!category.slug.trim()) {
      toast.error("Category slug is required");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      let imageUrl = category.existingImageUrl;

      if (category.image) {
        const formData = new FormData();
        formData.append("category", category.image);
        const uploadResponse = await api.post("/api/upload/category", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (!uploadResponse.data.success) {
          toast.error(uploadResponse.data.message || "Failed to upload image");
          return;
        }
        imageUrl = uploadResponse.data.image_URL;
      }

      const response = await api.patch(`/api/categories/${existing._id}`, {
        name: category.name.trim(),
        slug: category.slug.trim(),
        image: imageUrl,
        shortDescription: category.shortDescription.trim(),
        displayOrder: Number(category.displayOrder) || 0,
        isActive: category.isActive,
      });

      if (response.data.success) {
        toast.success("Category updated successfully");
        onClose();
        if (onCategoryUpdated) onCategoryUpdated();
      } else {
        toast.error(response.data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">Edit Category</h2>
        <p className="text-sm text-text-secondary mt-1">Update this category's details or image</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Name <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={category.name}
              onChange={changeHandler}
              disabled={isLoading}
              required
              className="shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="slug" className="text-sm font-medium text-foreground">
              Slug <span className="text-danger">*</span>
            </Label>
            <Input
              id="slug"
              type="text"
              name="slug"
              value={category.slug}
              onChange={changeHandler}
              disabled={isLoading}
              required
              className="shadow-sm bg-secondary"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="shortDescription" className="text-sm font-medium text-foreground">
              Short Description
            </Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={category.shortDescription}
              onChange={changeHandler}
              disabled={isLoading}
              className="shadow-sm"
            />
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
                value={category.displayOrder}
                onChange={changeHandler}
                disabled={isLoading}
                min="0"
                className="shadow-sm"
              />
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="isActive"
                checked={category.isActive}
                onChange={changeHandler}
                disabled={isLoading}
                className="size-4 accent-primary"
              />
              Active
            </label>
          </div>

          <div className="space-y-3">
            <Label htmlFor="image" className="text-sm font-medium text-foreground">
              Image
            </Label>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                <img
                  src={category.image ? URL.createObjectURL(category.image) : category.existingImageUrl}
                  alt="Current"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-text-muted-2">Current image — upload a new one below to replace it</span>
            </div>
            <div
              className={cn(
                "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors",
                isDragging
                  ? "border-primary bg-accent"
                  : "border-border hover:border-primary/50",
                category.image ? "border-success bg-success-bg" : ""
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                {category.image ? (
                  <div className="space-y-2">
                    <p className="text-sm text-success">New image selected: {category.image.name}</p>
                    <button
                      type="button"
                      onClick={() => setCategory((prev) => ({ ...prev, image: null }))}
                      className="text-xs text-danger hover:text-danger/80"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex text-sm text-text-secondary">
                      <label htmlFor="image" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                        <span>Upload a new file</span>
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          onChange={changeHandler}
                          accept="image/*"
                          className="sr-only"
                          disabled={isLoading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-text-muted-2">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" variant="default" disabled={isLoading} className="w-full py-6 text-base font-medium shadow-sm">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
