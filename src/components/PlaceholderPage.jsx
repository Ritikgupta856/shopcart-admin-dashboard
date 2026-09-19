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
import Heading from "./Heading";
import EmptyState from "./EmptyState";

const notReady = () =>
  toast("Not connected to the backend yet — coming soon.", { icon: "🚧" });

const PlaceholderPage = ({
  title,
  description,
  icon,
  columns = [],
  actionLabel,
  emptyTitle = "Nothing here yet",
  emptyDescription = "This section isn't wired up to the backend yet — the UI is ready for when it is.",
}) => {
  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title={title}
        description={description}
        actions={
          actionLabel && (
            <Button onClick={notReady}>{actionLabel}</Button>
          )
        }
      />

      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-soft">
        {columns.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                {columns.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
        {columns.length === 0 && (
          <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
        )}
      </div>
    </div>
  );
};

export default PlaceholderPage;
