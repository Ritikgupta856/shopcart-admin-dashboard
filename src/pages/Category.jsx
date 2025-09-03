import { useContext, useState, useMemo } from "react";
import axios from "axios";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/categories/${
          categoryToDelete._id
        }`
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
    <div className="w-full min-h-screen p-0 sm:p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Heading
            title={`Categories (${categories.length})`}
            description="Manage your product categories"
          />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="w-full sm:w-auto">+ Add New Category</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <AddCategory
              onClose={() => setOpen(false)}
              onCategoryAdded={() => getCategories()}
            />
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <div className="relative mb-6">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
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
                  <TableHead>Category Name</TableHead>
                  <TableHead className="w-20 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      {searchTerm ? (
                        <div className="space-y-2">
                          <p className="text-gray-500">
                            No categories found matching "{searchTerm}"
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
                          <p className="text-gray-500">No categories found</p>
                          <p className="text-sm text-gray-400">
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
                      className="hover:bg-gray-50/50"
                    >
                      <TableCell className="text-center font-medium">
                        {categories.findIndex(
                          (cat) => cat._id === category._id
                        ) + 1}
                      </TableCell>
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
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
                            className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
                            style={{
                              display: category.image ? "none" : "flex",
                            }}
                          >
                            No Image
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">
                            {category.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: {category._id}
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
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
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
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredCategories.length} of {categories.length}{" "}
              categories
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Category;
