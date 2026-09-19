import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "@/Context/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-6 bg-card p-8 rounded-xl shadow-soft border border-border"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center size-10 rounded-lg bg-accent">
            <img src="/logo.svg" alt="ShopCart logo" className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Admin Sign In</h1>
            <p className="text-sm text-text-secondary mt-1">ShopCart admin dashboard</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
