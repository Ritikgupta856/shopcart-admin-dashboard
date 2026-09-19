import api from "@/lib/api";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState("0");
  const [banners, setBanners] = useState([]);
  const [deals, setDeals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // ✅ Fetch categories
  const getCategories = async () => {
    try {
      const categoryResponse = await api.get("/api/categories");
      setCategories(categoryResponse.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ✅ Fetch products
  const getProducts = async () => {
    try {
      const response = await api.get("/api/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ✅ Fetch orders
  const getOrdersDetails = async () => {
    try {
      const response = await api.get("/api/orders");
      setOrders(response.data.orders);
      setTotalRevenue(response.data.totalRevenue);
    } catch (error) {
      console.error("Error fetching Orders details:", error);
    }
  };

  // ✅ Fetch users
  const getUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // ✅ Fetch banners
  const getBanners = async () => {
    try {
      const response = await api.get("/api/banners");
      setBanners(response.data.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  // ✅ Fetch deals
  const getDeals = async () => {
    try {
      const response = await api.get("/api/deals");
      setDeals(response.data.deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  // ✅ Fetch reviews
  const getReviews = async () => {
    try {
      const response = await api.get("/api/reviews");
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // ✅ Fetch coupons
  const getCoupons = async () => {
    try {
      const response = await api.get("/api/coupons");
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  // Run once on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    getCategories();
    getProducts();
    getOrdersDetails();
    getUsers();
    getBanners();
    getDeals();
    getReviews();
    getCoupons();
  }, []);

  return (
    <AppContext.Provider
      value={{
        categories,
        products,
        users,
        orders,
        totalRevenue,
        banners,
        deals,
        reviews,
        coupons,
        getCategories,
        getProducts,
        getOrdersDetails,
        getUsers,
        getBanners,
        getDeals,
        getReviews,
        getCoupons,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
