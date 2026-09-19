import { useContext, useState, useMemo } from "react";
import api from "@/lib/api";
import { MdOutlineClose, MdSearch } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AppContext } from "@/Context/AppContext";
import Heading from "../components/Heading";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import AddCategory from "../components/AddCategory";
import toast from "react-hot-toast";

const Category = () => {
  const { categories ,getCategories } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const removeCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsLoading(true);
      const response = await api.delete(
        `/api/categories/${categoryToDelete._id}`
      );
      toast.success("Category removed successfully");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      getCategories();
    } catch (error) {
      console.error("Error removing Category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title="Categories"
        description="Manage your product categories."
        actions={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto">+ Add Category</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96">
              <AddCategory
                onClose={() => setOpen(false)}
                onCategoryAdded={() => getCategories()}
              />
            </SheetContent>
          </Sheet>
        }
      />

      <div className="relative max-w-sm">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-2 h-4 w-4" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-20 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  {searchTerm ? (
                    <div className="space-y-2">
                      <p className="text-text-secondary text-sm">
                        No categories found matching "{searchTerm}"
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
                      <p className="text-text-secondary text-sm">No categories found</p>
                      <p className="text-xs text-text-muted-2">
                        Add your first category to get started
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category, index) => (
                <TableRow
                  key={category._id}
                  className="hover:bg-secondary/60"
                >
                  <TableCell className="text-center text-text-secondary text-sm">
                    {categories.findIndex(
                      (cat) => cat._id === category._id
                    ) + 1}
                  </TableCell>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full bg-secondary flex items-center justify-center text-text-muted-2 text-[10px]"
                        style={{
                          display: category.image ? "none" : "flex",
                        }}
                      >
                        No Image
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground text-sm">
                        {category.name}
                      </p>
                      <p className="text-xs text-text-muted-2">
                        ID: {category._id.slice(-8)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <AlertDialog
                      open={
                        deleteDialogOpen &&
                        categoryToDelete?._id === category._id
                      }
                      onOpenChange={(open) => {
                        if (!open) {
                          setDeleteDialogOpen(false);
                          setCategoryToDelete(null);
                        }
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(category)}
                          disabled={isLoading}
                          className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger-bg"
                        >
                          <MdOutlineClose className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Category
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the category "
                            {category.name}"? This action cannot be undone
                            and may affect products associated with this
                            category.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isLoading}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={removeCategory}
                            disabled={isLoading}
                            className="bg-danger text-white hover:bg-danger/90 focus:ring-danger"
                          >
                            {isLoading ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {searchTerm && filteredCategories.length > 0 && (
        <div className="text-sm text-text-muted-2">
          Showing {filteredCategories.length} of {categories.length}{" "}
          categories
        </div>
      )}
    </div>
  );
};

export default Category;
