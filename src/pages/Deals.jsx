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
import AddDeal from "../components/AddDeal";
import { MdOutlineClose, MdLocalFireDepartment } from "react-icons/md";

const Deals = () => {
  const { deals, getDeals } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  const removeDeal = async () => {
    if (!dealToDelete) return;
    setIsLoading(true);
    try {
      await api.delete(`/api/deals/${dealToDelete._id}`);
      toast.success("Deal removed successfully");
      setDealToDelete(null);
      getDeals();
    } catch (error) {
      toast.error("Error removing deal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title="Deals"
        description="Manage limited-time promotional deals shown on the storefront."
        actions={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto">+ Add Deal</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96">
              <AddDeal onClose={() => setOpen(false)} onDealAdded={() => getDeals()} />
            </SheetContent>
          </Sheet>
        }
      />

      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-24">Preview</TableHead>
              <TableHead>Deal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <EmptyState icon={MdLocalFireDepartment} title="No deals yet" description="Add your first promotional deal to get started." />
                </TableCell>
              </TableRow>
            ) : (
              deals.map((deal) => (
                <TableRow key={deal._id} className="hover:bg-secondary/60">
                  <TableCell>
                    <div className="w-16 h-10 rounded-md overflow-hidden bg-secondary">
                      <img src={deal.bannerImage} alt={deal.name} className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm text-foreground">{deal.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={deal.isActive ? "success" : "secondary"}>
                      {deal.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDealToDelete(deal)}
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

      <AlertDialog open={dealToDelete !== null} onOpenChange={(o) => !o && setDealToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{dealToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeDeal} disabled={isLoading} className="bg-danger text-white hover:bg-danger/90">
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Deals;
