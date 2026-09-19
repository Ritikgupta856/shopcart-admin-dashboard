import { useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const AddCategory = ({ onClose, onCategoryAdded }) => {
  const [category, setCategory] = useState({
    name: "",
    slug: "",
    image: null,
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
      setCategory(prev => ({ ...prev, image: file }));
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
    const { name, value, files } = e.target;

    if (name === "image") {
      setCategory({ ...category, [name]: files[0] });
    } else if (name === "name") {
      const newSlug = generateSlug(value);
      setCategory({
        ...category,
        [name]: value,
        slug: newSlug,
      });
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
    if (!category.image) {
      toast.error("Category image is required");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("category", category.image);

      const uploadResponse = await api.post(
        "/api/upload/category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data.success) {
        const categoryData = {
          name: category.name.trim(),
          slug: category.slug.trim(),
          image: uploadResponse.data.image_URL,
        };

        const addCategoryResponse = await api.post(
          "/api/categories",
          categoryData
        );

        if (addCategoryResponse.data.success) {
          toast.success("Category added successfully");

          // Reset form
          setCategory({
            name: "",
            slug: "",
            image: null,
          });

    
          if (onClose) onClose();
          if (onCategoryAdded) onCategoryAdded();
        } else {
          toast.error(
            addCategoryResponse.data.message || "Failed to add category"
          );
        }
      } else {
        toast.error(uploadResponse.data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">Add Category</h2>
        <p className="text-sm text-text-secondary mt-1">Create a new category for your products</p>
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
              placeholder="Enter category name"
              className="shadow-sm"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="slug" className="text-sm font-medium text-foreground flex items-center justify-between">
              <span>Slug <span className="text-danger">*</span></span>
              <span className="text-xs text-text-muted-2">Auto-generated from name</span>
            </Label>
            <Input
              id="slug"
              type="text"
              name="slug"
              value={category.slug}
              onChange={changeHandler}
              disabled={isLoading}
              required
              placeholder="category-slug"
              className="shadow-sm bg-secondary"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="image" className="text-sm font-medium text-foreground">
              Image <span className="text-danger">*</span>
            </Label>
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
                    <svg className="mx-auto h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-success">Image selected: {category.image.name}</p>
                    <button
                      type="button"
                      onClick={() => setCategory(prev => ({ ...prev, image: null }))}
                      className="text-xs text-danger hover:text-danger/80"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-text-muted-2" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-text-secondary">
                      <label htmlFor="image" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                        <span>Upload a file</span>
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          onChange={changeHandler}
                          accept="image/*"
                          className="sr-only"
                          disabled={isLoading}
                          required
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
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full py-6 text-base font-medium shadow-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Category...
                </div>
              ) : (
                "Add Category"
              )}
            </Button>
          </div>
        </form>
      </div>
      <style>{`
        .flex-1::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AddCategory;
