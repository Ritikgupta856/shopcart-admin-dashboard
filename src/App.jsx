import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppProvider from "./Context/AppContext";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import SignInPage from "./components/Sign-in";
import { SidebarProvider } from "./components/ui/sidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import { Suspense, lazy, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Loader } from "./components/Loader";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Category = lazy(() => import("./pages/Category"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));
const User = lazy(() => import("./pages/User"));

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AuthGuard = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in', { 
        replace: true,
        state: { from: location.pathname } 
      });
    }
  }, [isLoaded, isSignedIn, navigate, location]);

  if (!isLoaded) {
    return <Loader />;
  }

  return isSignedIn ? children : null;
};

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 w-full overflow-x-hidden bg-gray-50/50">
          <PageTransition>
            <div className="min-h-screen">
              <Suspense fallback={<Loader />}>{children}</Suspense>
            </div>
          </PageTransition>
        </main>
      </div>
    </SidebarProvider>
  );
};

const routes = [
  { path: "/", component: Dashboard },
  { path: "/categories", component: Category },
  { path: "/products", component: Products },
  { path: "/orders", component: Orders },
  { path: "/users", component: User },
];

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
          <Routes>
            <Route
              path="/sign-in"
              element={
                <SignedOut>
                  <SignInPage />
                </SignedOut>
              }
            />

            {routes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <Component />
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
            ))}

            <Route
              path="*"
              element={
                <AuthGuard>
                  <Navigate to="/" replace />
                </AuthGuard>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ClerkProvider>
  );
}

export default App;
