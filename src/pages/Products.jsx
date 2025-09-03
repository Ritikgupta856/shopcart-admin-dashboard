import { useContext, useState, useMemo } from "react";
import axios from "axios";
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
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/products/${productToDelete._id}`);
      toast.success("Product removed successfully");
      setProductToDelete(null);
      getProducts();
    } catch (error) {
      toast.error("Error removing Product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-0 sm:p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Heading
            title={`Products (${products.length})`}
            description="Manage your products"
          />
        </div>
         <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="w-full sm:w-auto">+ Add New Product</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <AddProducts
              onClose={() => setOpen(false)}
              onProductAdded={() => getProducts()}
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="relative mb-6">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead className="w-32">Thumbnail</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-20 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm ? (
                    <div className="space-y-2">
                      <p className="text-gray-500">
                        No products found matching "{searchTerm}"
                      </p>
                      <Button
                        onClick={() => setSearchTerm("")}
                        className="text-sm"
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-500">No products found</p>
                      <p className="text-sm text-gray-400">
                        Add your first product to get started
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => (
                <TableRow key={product._id} className="hover:bg-gray-50/50">
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
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
                        className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
                        style={{ display: product.image ? "none" : "flex" }}
                      >
                        No Image
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">ID: {product._id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}</TableCell>
                  <TableCell className="font-medium">{product.category.name}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProductToDelete(product)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
        <div className="mt-4 text-sm text-gray-600">
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
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
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
