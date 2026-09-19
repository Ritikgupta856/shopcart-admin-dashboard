import { useContext, useState, useMemo } from "react";
import api from "@/lib/api";
import { MdOutlineClose, MdSearch } from "react-icons/md";
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
import toast from "react-hot-toast";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import AddProducts from "../components/AddProducts";
import Heading from "../components/Heading";
import { Input } from "@/components/ui/input";
import { StockBadge } from "@/components/StatusBadge";


const Products = () => {
  const { products,getProducts } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const removeProduct = async () => {
    if (!productToDelete) return;
    setIsLoading(true);
    try {
      const response = await api.delete(`/api/products/${productToDelete._id}`);
      toast.success("Product removed successfully");
      setProductToDelete(null);
      getProducts();
    } catch (error) {
      toast.error("Error removing Product");
    } finally {
      setIsLoading(false);
    }
  };

  const getStock = (product) =>
    product.hasVariants ? product.totalStock : product.stock ?? product.totalStock ?? 0;

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title="Products"
        description="Manage your product catalog and inventory."
        actions={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto">+ Add Product</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96">
              <AddProducts
                onClose={() => setOpen(false)}
                onProductAdded={() => getProducts()}
              />
            </SheetContent>
          </Sheet>
        }
      />
      <div className="relative">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-2 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>
      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-20 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  {searchTerm ? (
                    <div className="space-y-2">
                      <p className="text-text-secondary text-sm">
                        No products found matching "{searchTerm}"
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-text-secondary text-sm">No products found</p>
                      <p className="text-xs text-text-muted-2">
                        Add your first product to get started
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => (
                <TableRow key={product._id} className="hover:bg-secondary/60">
                  <TableCell className="text-center text-text-secondary text-sm">{index + 1}</TableCell>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full bg-secondary flex items-center justify-center text-text-muted-2 text-[10px]"
                        style={{ display: product.image ? "none" : "flex" }}
                      >
                        No Image
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground text-sm">{product.name}</p>
                      <p className="text-xs text-text-muted-2">ID: {product._id.slice(-8)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm text-foreground">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}</TableCell>
                  <TableCell className="text-sm text-text-secondary">{product.category.name}</TableCell>
                  <TableCell>
                    <StockBadge stock={getStock(product)} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProductToDelete(product)}
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
      {searchTerm && filteredProducts.length > 0 && (
        <div className="text-sm text-text-muted-2">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}
      {/* Delete Dialog */}
      <AlertDialog
        open={productToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeProduct}
              disabled={isLoading}
              className="bg-danger text-white hover:bg-danger/90 focus:ring-danger"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
