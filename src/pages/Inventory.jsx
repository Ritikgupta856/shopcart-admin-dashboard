import { useContext, useState, useMemo } from "react";
import { AppContext } from "@/Context/AppContext";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Heading from "../components/Heading";
import EmptyState from "@/components/EmptyState";
import { StockBadge } from "@/components/StatusBadge";
import { MdSearch, MdInventory } from "react-icons/md";

const Inventory = () => {
  const { products } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");

  const rows = useMemo(() => {
    const list = products.flatMap((product) => {
      if (product.variants?.length > 0) {
        return product.variants.map((v) => ({
          key: `${product._id}-${v._id}`,
          name: product.name,
          image: product.image,
          variantLabel: [v.size, v.color].filter(Boolean).join(" / "),
          stock: v.stock,
        }));
      }
      return [
        {
          key: product._id,
          name: product.name,
          image: product.image,
          variantLabel: "-",
          stock: product.stock ?? 0,
        },
      ];
    });
    if (!searchTerm) return list;
    return list.filter((row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title="Inventory"
        description="Track stock levels across your products and variants."
      />
      <div className="relative max-w-sm">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-2 h-4 w-4" />
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <EmptyState
                    icon={MdInventory}
                    title="No inventory to show"
                    description={
                      searchTerm
                        ? `No products match "${searchTerm}"`
                        : "Add products to start tracking stock."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.key} className="hover:bg-secondary/60">
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                      {row.image && (
                        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm text-foreground">{row.name}</TableCell>
                  <TableCell className="text-sm text-text-secondary">{row.variantLabel}</TableCell>
                  <TableCell>
                    <StockBadge stock={row.stock} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Inventory;
