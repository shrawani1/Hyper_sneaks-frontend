import axios from "axios";

// Creating backend Config
const Api = axios.create({
    baseURL: "https://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data"
    }
});

// Function to get token from localStorage
const getToken = () => localStorage.getItem('token');
const jsonConfig = {
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  

// Config for requests requiring authorization
const getConfig = () => ({
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
});

const config = {
  headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
  },
}

// Test API
export const testApi = () => Api.get("/test");

// Register API
export const registerUserApi = (data) => Api.post('/api/user/create', data);

// Login API
export const loginUserApi = (data) => Api.post('/api/user/login', data);

// Admin dashboard API
export const adminDashboardApi = (data) => Api.post('/api/user/adminDashboard', data);

// Create product API
export const createProductApi = (data) => Api.post('/api/product/create', data);

// Get all products API
export const getAllProducts = () => Api.get('/api/product/get_all_products', getConfig());

// Get single product API
export const getSingleProduct = (id) => Api.get(`/api/product/get_single_product/${id}`, getConfig());

// Delete product API
export const deleteProduct = (id) => Api.delete(`/api/product/delete_product/${id}`, getConfig());

// Update product API
export const updateProduct = (id, data) => Api.put(`/api/product/update_product/${id}`, data, getConfig());

// Forgot password API
export const forgotPasswordApi = (data) => Api.post('/api/user/forgot_password', data);

// Verify OTP API
export const verifyOtpApi = (data) => Api.post('/api/user/verify_otp', data);

// Get user profile API
export const getUserProfileApi = () => Api.get('/api/user/profile', getConfig());

// Update user profile API
export const updateUserProfileApi = (data) => Api.put('/api/user/profile', data, getConfig());



// Product pagination API
export const productPagination = (page, limit, searchQuery = '', sortOrder = 'asc') => {
    const query = `?page=${page}&limit=${limit}&q=${searchQuery}&sort=${sortOrder}`;
    return Api.get(`/api/product/pagination${query}`, getConfig());
};

// Product count API
export const productCount = () => Api.get('/api/product/get_product_count', getConfig());



// Get user details API
export const getUserDetails = (userId) => Api.get(`/api/user/${userId}`, getConfig());


// Add to cart
export const addToCartApi = (data) => Api.post("/api/cart/add", data, config);

// get all cart
export const getAllCartApi = () => Api.get("/api/cart/all", config);

// update cart
export const updateCartApi = (id, data) =>
  Api.put(`/api/cart/update/${id}`, data, config);

// delete cart
export const deleteCartApi = (id) =>
  Api.delete(`/api/cart/delete/${id}`, config);



// delete favorite
export const deleteFromFavoriteApi = (id) =>
  Api.delete(`/api/favourite/delete/${id}`, config);

// get orders/bills
export const getOrdersApi = () => Api.get("/api/order/get", config);

// get user orders
export const getUserOrdersApi = () => Api.get("/api/order/user", config);

// create order
export const createOrderApi = (data) =>
  Api.post("/api/order/create", data, jsonConfig);

// update order
export const updateOrderApi = (id, data) =>
  Api.put(`/api/order/update/${id}`, data, config);

// update Status order
export const updateOrderStatusApi = (id, data) =>
  Api.put(`/api/order/update/${id}`, data, config);

// update carts status
export const updateCartStatusApi = (data) =>
  Api.put(`/api/cart/status`, data, config);

// get favorite by user
export const getFavoriteByUserApi = () => Api.get("/api/favourite/get", config);

//add fav
export const addToFavoriteApi = (data) =>Api.post("/api/favourite/add", data, config);

// get all favorite
export const getAllFavoriteApi = () => Api.get("/api/favourite/all", config);

//contact us
export const getAllContacts = () => Api.get('/api/contact/all', config);

// Review APIs
 
export const addReviewApi = (data) => Api.post('/api/rating/add', data,config);
export const getReviewsApi = (productId) => Api.get(`/api/rating/product/${productId}`);

// Verify email  
export const verifyEmailApi = (data) =>
  Api.put(`/api/user/verifyEmail/${data.token}`);


