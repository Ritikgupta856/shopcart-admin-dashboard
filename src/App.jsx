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
import AuthProvider, { AuthContext } from "./Context/AuthContext";
import SignInPage from "./components/Sign-in";
import { SidebarProvider } from "./components/ui/sidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import { Suspense, lazy, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Loader } from "./components/Loader";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Category = lazy(() => import("./pages/Category"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));
const User = lazy(() => import("./pages/User"));
const Brands = lazy(() => import("./pages/Brands"));
const Attributes = lazy(() => import("./pages/Attributes"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Coupons = lazy(() => import("./pages/Coupons"));
const Payments = lazy(() => import("./pages/Payments"));
const Banners = lazy(() => import("./pages/Banners"));
const Deals = lazy(() => import("./pages/Deals"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Reports = lazy(() => import("./pages/Reports"));


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
  const { isLoading, isSignedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      navigate('/sign-in', {
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [isLoading, isSignedIn, navigate, location]);

  if (isLoading) {
    return <Loader />;
  }

  return isSignedIn ? children : null;
};

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 w-full overflow-x-hidden bg-background">
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
  { path: "/products", component: Products },
  { path: "/categories", component: Category },
  { path: "/brands", component: Brands },
  { path: "/attributes", component: Attributes },
  { path: "/inventory", component: Inventory },
  { path: "/reviews", component: Reviews },
  { path: "/orders", component: Orders },
  { path: "/users", component: User },
  { path: "/coupons", component: Coupons },
  { path: "/payments", component: Payments },
  { path: "/banners", component: Banners },
  { path: "/deals", component: Deals },
  { path: "/analytics", component: Analytics },
  { path: "/reports", component: Reports },
];

const SignInRoute = () => {
  const { isLoading, isSignedIn } = useContext(AuthContext);
  if (isLoading) return <Loader />;
  return isSignedIn ? <Navigate to="/" replace /> : <SignInPage />;
};

function App() {
  return (
    <AuthProvider>
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
            <Route path="/sign-in" element={<SignInRoute />} />

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
    </AuthProvider>
  );
}

export default App;
