import { useContext, useState, useMemo } from "react";
import { AppContext } from "@/Context/AppContext";
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
import Heading from "../components/Heading";
import { MdSearch } from "react-icons/md";

const User = () => {
  const { users } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter((user) =>
      (user.fullname && user.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 bg-background">
      <Heading
        title="Customers"
        description="View registered customers."
      />
      <div className="relative max-w-sm">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-2 h-4 w-4" />
        <Input
          placeholder="Search customers by name or email..."
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
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  {searchTerm ? (
                    <div className="space-y-2">
                      <p className="text-text-secondary text-sm">
                        No customers found matching "{searchTerm}"
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
                      <p className="text-text-secondary text-sm">No customers found</p>
                      <p className="text-xs text-text-muted-2">
                        No customers have registered yet
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, index) => (
                <TableRow key={user._id} className="hover:bg-secondary/60">
                  <TableCell className="text-center text-text-secondary text-sm">{index + 1}</TableCell>
                  <TableCell className="font-medium text-sm text-foreground">{user.fullname}</TableCell>
                  <TableCell className="text-sm text-text-secondary">{user.email}</TableCell>
                  <TableCell className="text-sm text-text-secondary">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {searchTerm && filteredUsers.length > 0 && (
        <div className="text-sm text-text-muted-2">
          Showing {filteredUsers.length} of {users.length} customers
        </div>
      )}
    </div>
  );
};

export default User;
