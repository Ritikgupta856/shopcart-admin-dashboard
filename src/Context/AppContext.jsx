import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState("0");

  // ✅ Fetch categories
  const getCategories = async () => {
    try {
      const categoryResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/categories`
      );
      setCategories(categoryResponse.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ✅ Fetch products
  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/products`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ✅ Fetch orders
  const getOrdersDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/orders`
      );
      setOrders(response.data.orders);
      setTotalRevenue(response.data.totalRevenue);
    } catch (error) {
      console.error("Error fetching Orders details:", error);
    }
  };

  // ✅ Fetch users
  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/users`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Run once on mount
  useEffect(() => {
    getCategories();
    getProducts();
    getOrdersDetails();
    getUsers();
  }, []);

  return (
    <AppContext.Provider
      value={{
        categories,
        products,
        users,
        orders,
        totalRevenue,
        getCategories,  
        getProducts,
        getOrdersDetails,
        getUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
