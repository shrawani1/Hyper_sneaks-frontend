import React, { useState, useEffect } from 'react';
import { createProductApi, deleteProduct, getAllProducts, getOrdersApi, updateOrderStatusApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.log(error);
      });

    getOrdersApi()
      .then((res) => {
        setOrders(res.data.orders);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const handleImage = (event) => {
    const file = event.target.files[0];
    setProductImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductDescription('');
    setProductImage('');
    setPreviewImage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productCategory', productCategory);
    formData.append('productDescription', productDescription);
    formData.append('productImage', productImage);

    createProductApi(formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          resetForm();
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.warning(error.response.data.message);
          } else if (error.response.status === 500) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        } else {
          toast.error("something went wrong");
        }
      });
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm("Are you sure you want to delete?");
    if (confirmDialog) {
      deleteProduct(id)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            window.location.reload();
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            toast.error(error.response.data.message);
          }
        });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatusApi(orderId, { status: newStatus });
      if (response.status === 200) {
        toast.success("Order status updated successfully");
        const updatedOrders = await getOrdersApi();
        setOrders(updatedOrders.data.orders);
      }
    } catch (error) {
      toast.error("An error occurred while updating the order status");
    }
  };

  return (
    <>
      <div className="container-fluid p-4" style={{ backgroundColor: '#e9f5ff' }}>

        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Product List</h5>
              </div>
              <div className="card-body">
                <table className="table table-hover mt-4">
                  <thead className="table-dark">
                    <tr>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Product Price</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((singleProduct) => (
                      <tr key={singleProduct._id}>
                        <td>
                          <img
                            width="40px"
                            height="40px"
                            src={`https://localhost:5000/products/${singleProduct.productImage}`}
                            alt={`${singleProduct.productName}`}
                            className="rounded"
                          />
                        </td>
                        <td>{singleProduct.productName}</td>
                        <td>{singleProduct.productPrice}</td>
                        <td>{singleProduct.productCategory}</td>
                        <td>{singleProduct.productDescription}</td>
                        <td>
                          <Link
                            to={`/admin/update/${singleProduct._id}`}
                            className="btn btn-primary btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(singleProduct._id)}
                            className="btn btn-danger btn-sm ms-2"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Order List</h5>
              </div>
              <div className="card-body">
                <table className="table table-hover mt-4">
                  <thead className="table-dark">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Payment type</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.userId.firstName}</td>
                        <td>{order.paymentType}</td>
                        <td>{order.carts.length}</td>
                        <td>{order.status}</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOrderModalVisible(true);
                            }}
                          >
                            Change Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <h3 className="text-2xl font-bold">Admin Dashboard</h3>
          </div>
          <div className="col text-end">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Add Products
            </button>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create a New Product
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Enter product Name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Product Price</label>
                    <input
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      type="number"
                      className="form-control"
                      placeholder="Enter product price"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Choose Category</label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="form-control"
                    >
                      <option value="">--Select Category--</option>
                      <option value="tv">TV</option>
                      <option value="Small Appliances">Small Appliances</option>
                      <option value="Big Appliances">Big Appliances</option>
                      <option value="Solar">Solar</option>
                      <option value="Kitchen Appliances">Kitchen Appliances</option>
                      <option value="Air conditioner">Air Conditioner</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Product Description</label>
                    <input
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Choose Product Image</label>
                    <input
                      onChange={handleImage}
                      type="file"
                      className="form-control"
                    />
                  </div>

                  {previewImage && (
                    <div className="mb-3">
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ maxWidth: '200px' }}
                      />
                    </div>
                  )}

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {orderModalVisible && selectedOrder && (
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            tabIndex="-1"
            aria-labelledby="orderModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="orderModalLabel">Update Order Status</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOrderModalVisible(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Order ID: {selectedOrder._id}</p>
                  <p>Customer: {selectedOrder.userId.firstName}</p>
                  <p>Payment: {selectedOrder.paymentType}</p>
                  <p>Current Status: {selectedOrder.status}</p>
                  <div className="mb-3">
                    <label className="form-label">Update Status</label>
                    <select
                      className="form-control"
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processed">Processed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setOrderModalVisible(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
