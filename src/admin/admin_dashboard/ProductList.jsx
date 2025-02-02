import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    
    const dummyProducts = [
      { _id: 1, productName: 'Product 1', productPrice: 100, productCategory: 'Category A', productDescription: 'Description A' },
      { _id: 2, productName: 'Product 2', productPrice: 200, productCategory: 'Category B', productDescription: 'Description B' },
      { _id: 3, productName: 'Product 3', productPrice: 300, productCategory: 'Category C', productDescription: 'Description C' },
    ];
    setProducts(dummyProducts);
  }, []);

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log(`Deleting product with id ${id}`);
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#e9f5ff' }}>
      <div className="row mb-4">
        <div className="col">
          <h3 className="text-2xl font-bold">Product List</h3>
        </div>
        <div className="col text-end">
          <Link to="/admin/add-product" className="btn btn-primary">
            Add Product
          </Link>
        </div>
      </div>

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
    </div>
  );
};

export default ProductList;
