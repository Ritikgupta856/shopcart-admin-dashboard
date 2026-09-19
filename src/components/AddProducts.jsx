import { useContext, useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppContext } from "@/Context/AppContext";
import Heading from "./Heading";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const AddProducts = ({ onClose, onProductAdded }) => {
  const { categories } = useContext(AppContext);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    mrp: "",
    brand: "",
    image: null,
    category: "",
    stock: "",
    isTrending: false,
    isNewArrival: false,
  });
  const [variants, setVariants] = useState([]);
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
      setProduct(prev => ({ ...prev, image: file }));
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
      setProduct({ ...product, [name]: files[0] });
    } else if (name === "name") {
      const newSlug = generateSlug(value);
      setProduct({ ...product, name: value, slug: newSlug });
    } else if (type === "checkbox") {
      setProduct({ ...product, [name]: checked });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const addVariantRow = () => {
    setVariants((prev) => [...prev, { size: "", color: "", stock: "" }]);
  };

  const updateVariantRow = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const removeVariantRow = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!product.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!product.slug.trim()) {
      toast.error("Product slug is required");
      return false;
    }
    if (!product.price || isNaN(product.price)) {
      toast.error("Valid price is required");
      return false;
    }
    if (!product.category) {
      toast.error("Category is required");
      return false;
    }
    if (!product.image) {
      toast.error("Product image is required");
      return false;
    }
    if (variants.length > 0) {
      for (const v of variants) {
        if (!v.size.trim() && !v.color.trim()) {
          toast.error("Each variant needs a size or a color");
          return false;
        }
        if (v.stock === "" || isNaN(v.stock) || Number(v.stock) < 0) {
          toast.error("Each variant needs a valid stock quantity");
          return false;
        }
      }
    } else if (product.stock === "" || isNaN(product.stock) || Number(product.stock) < 0) {
      toast.error("Valid stock quantity is required");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      let formData = new FormData();
      formData.append("product", product.image);
      const response = await api.post(
        "/api/upload/product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        const productData = {
          ...product,
          image: response.data.image_URL,
          variants: variants.map((v) => ({
            size: v.size.trim(),
            color: v.color.trim(),
            stock: Number(v.stock),
          })),
          stock: variants.length === 0 ? Number(product.stock) : undefined,
        };
        try {
          const addProductResponse = await api.post(
            "/api/products",
            productData
          );
          if (addProductResponse.data.success) {
            toast.success("Product added successfully");
            setProduct({
              name: "",
              slug: "",
              description: "",
              price: "",
              mrp: "",
              brand: "",
              image: null,
              category: "",
              stock: "",
              isTrending: false,
              isNewArrival: false,
            });
            setVariants([]);
            onClose();
            if (onProductAdded) onProductAdded();
          } else {
            toast.error(addProductResponse.data.message || "Failed to add product");
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      } else {
        toast.error(response.data.message || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-foreground">Add Product</h2>
        <p className="text-sm text-text-secondary mt-1">Add a new product to your store</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={product.name}
                onChange={changeHandler}
                className="shadow-sm"
                disabled={isLoading}
                placeholder="Enter product name"
                required
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
                value={product.slug}
                onChange={changeHandler}
                className="shadow-sm bg-secondary"
                disabled={isLoading}
                placeholder="product-slug"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={changeHandler}
              className="shadow-sm min-h-[100px]"
              disabled={isLoading}
              placeholder="Enter product description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="price" className="text-sm font-medium text-foreground">
                Price <span className="text-danger">*</span>
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted-2 sm:text-sm">₹</span>
                </div>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={changeHandler}
                  className="pl-7 shadow-sm"
                  disabled={isLoading}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="mrp" className="text-sm font-medium text-foreground">
                MRP (optional)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-muted-2 sm:text-sm">₹</span>
                </div>
                <Input
                  id="mrp"
                  type="number"
                  name="mrp"
                  value={product.mrp}
                  onChange={changeHandler}
                  className="pl-7 shadow-sm"
                  disabled={isLoading}
                  placeholder="Shown struck-through if higher than price"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="brand" className="text-sm font-medium text-foreground">
                Brand (optional)
              </Label>
              <Input
                id="brand"
                type="text"
                name="brand"
                value={product.brand}
                onChange={changeHandler}
                className="shadow-sm"
                disabled={isLoading}
                placeholder="e.g. Sony"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-medium text-foreground">
                Category <span className="text-danger">*</span>
              </Label>
              <select
                id="category"
                name="category"
                className="w-full border rounded-md shadow-sm py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                value={product.category}
                onChange={changeHandler}
                disabled={isLoading}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="isTrending"
                checked={product.isTrending}
                onChange={changeHandler}
                disabled={isLoading}
                className="size-4 accent-primary"
              />
              Trending
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={product.isNewArrival}
                onChange={changeHandler}
                disabled={isLoading}
                className="size-4 accent-primary"
              />
              New Arrival
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                Variants (optional)
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariantRow}
                disabled={isLoading}
              >
                + Add Variant
              </Button>
            </div>

            {variants.length === 0 ? (
              <div className="space-y-3">
                <Label htmlFor="stock" className="text-sm font-medium text-foreground">
                  Stock <span className="text-danger">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={changeHandler}
                  disabled={isLoading}
                  placeholder="Available quantity"
                  className="shadow-sm"
                  min="0"
                  required
                />
              </div>
            ) : (
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Size (e.g. M)"
                      value={variant.size}
                      onChange={(e) => updateVariantRow(index, "size", e.target.value)}
                      disabled={isLoading}
                      className="shadow-sm"
                    />
                    <Input
                      type="text"
                      placeholder="Color (e.g. Black)"
                      value={variant.color}
                      onChange={(e) => updateVariantRow(index, "color", e.target.value)}
                      disabled={isLoading}
                      className="shadow-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock}
                      onChange={(e) => updateVariantRow(index, "stock", e.target.value)}
                      disabled={isLoading}
                      className="shadow-sm w-28"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantRow(index)}
                      disabled={isLoading}
                      className="text-danger hover:text-danger/80 p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                product.image ? "border-success bg-success-bg" : ""
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                {product.image ? (
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-success">Image selected: {product.image.name}</p>
                    <button
                      type="button"
                      onClick={() => setProduct(prev => ({ ...prev, image: null }))}
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
                  Adding Product...
                </div>
              ) : (
                "Add Product"
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

export default AddProducts;
