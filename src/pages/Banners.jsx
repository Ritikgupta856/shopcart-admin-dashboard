import { useContext, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
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
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Heading from "../components/Heading";
import EmptyState from "@/components/EmptyState";
import AddBanner from "../components/AddBanner";
import { MdOutlineClose, MdViewCarousel } from "react-icons/md";

const Banners = () => {
  const { banners, getBanners } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  const removeBanner = async () => {
    if (!bannerToDelete) return;
    setIsLoading(true);
    try {
      await api.delete(`/api/banners/${bannerToDelete._id}`);
      toast.success("Banner removed successfully");
      setBannerToDelete(null);
      getBanners();
    } catch (error) {
      toast.error("Error removing banner");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title="Banners"
        description="Manage promotional banners displayed on the storefront homepage."
        actions={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto">+ Add Banner</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96">
              <AddBanner onClose={() => setOpen(false)} onBannerAdded={() => getBanners()} />
            </SheetContent>
          </Sheet>
        }
      />

      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-24">Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState icon={MdViewCarousel} title="No banners yet" description="Add your first hero banner to get started." />
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner._id} className="hover:bg-secondary/60">
                  <TableCell>
                    <div className="w-16 h-10 rounded-md overflow-hidden bg-secondary">
                      <img src={banner.desktopImage} alt={banner.title} className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm text-foreground">{banner.title}</p>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">{banner.displayOrder}</TableCell>
                  <TableCell>
                    <Badge variant={banner.isActive ? "success" : "secondary"}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBannerToDelete(banner)}
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

      <AlertDialog open={bannerToDelete !== null} onOpenChange={(o) => !o && setBannerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{bannerToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeBanner} disabled={isLoading} className="bg-danger text-white hover:bg-danger/90">
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Banners;
