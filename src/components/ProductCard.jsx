
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeOutlined, HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, Modal, Radio, Tooltip } from "antd";
import styled from "styled-components";
import { addToFavoriteApi, getReviewsApi, addToCartApi, createOrderApi } from '../apis/Api';

const StyledCard = styled(Card)`
  height: 100%;
  .ant-card-body {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ListViewProductImage = styled(Image)`
  width: 150px;
  height: 150px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProductInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PriceTag = styled.p`
  font-weight: bold;
  color: #1890ff;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }
  .ant-modal-header {
    border-radius: 8px 8px 0 0;
  }
  .ant-modal-body {
    padding: 24px;
  }
`;

const ProductCard = ({ productInformation, viewMode, color }) => {
  const [show, setShow] = useState(false);
  const [buyNowShow, setBuyNowShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const response = await getReviewsApi(productInformation._id);
      setReviews(response.data);
    } catch (error) {
      toast.error('Failed to fetch reviews.');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleBuyNowClose = () => setBuyNowShow(false);
  const handleBuyNowShow = () => {
    setQuantity(1);
    setAddress("");
    setPaymentMethod("");
    setBuyNowShow(true);
  };

  const handleAddToCart = async () => {
    try {
      const quantity = 1; // or set this to a variable if you have quantity input
      const total = quantity * productInformation.productPrice;
  
      await addToCartApi({ 
        productId: productInformation._id, 
        quantity: quantity, 
        total: total 
      });
      
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add to cart.");
    }
  };
  
  const addToFavourites = async () => {
    try {
      await addToFavoriteApi({ productId: productInformation._id });
      toast.success("Added to favourites successfully");
    } catch (error) {
      toast.error("Error adding to favourites");
    }
  };

  const placeOrder = async () => {
    if (!address || !paymentMethod) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createOrderApi({
        carts: [{ productId: productInformation._id, quantity }],
        address,
        totalAmount: totalPrice,
        paymentType: paymentMethod,
      });
      toast.success("Order Successful");
      handleBuyNowClose();
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  const totalPrice = productInformation.productPrice * quantity;

  const cardContent = (
    <>
      <ProductImage
        src={`http://localhost:5000/products/${productInformation.productImage}`}
        alt={productInformation.productName}
        preview={false}
        onClick={handleShow}
      />
      <ProductInfo>
        <h3>{productInformation.productName}</h3>
        <PriceTag>Rs {productInformation.productPrice}</PriceTag>
        <ActionButtons>
          <Tooltip title="Add to Cart">
            <Button
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </Tooltip>
          <Tooltip title="Add to Favorites">
            <Button
              icon={<HeartOutlined />}
              onClick={addToFavourites}
            />
          </Tooltip>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={handleShow} />
          </Tooltip>
        </ActionButtons>
      </ProductInfo>
    </>
  );

  return (
    <>
      <div className="card" style={{ width: '18rem', height: '100%', position: 'relative' }}>
        <span
          style={{ backgroundColor: color }}
          className='badge position-absolute top-0'
        >
          {productInformation.productCategory}
        </span>
        <img
          src={`http://localhost:5000/products/${productInformation.productImage}`}
          className="card-img-top"
          alt="Product"
          style={{ height: '12rem', objectFit: 'cover' }}
          onClick={handleShow}
        />
        <div
          className="heart-button"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Light background for visibility
            border: '2px solid rgba(0, 0, 0, 0.2)', // Border for better definition
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1,
          }}
          onClick={addToFavourites}
        >
          <i className="fas fa-heart" style={{ color: 'red', fontSize: '20px' }}></i>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100% - 12rem)' }}>
          <div className='d-flex justify-content-between'>
            <h5 className="card-title">{productInformation.productName}</h5>
            <h5 className="card-title text-danger">Rs {productInformation.productPrice}</h5>
          </div>
          <p className="card-text">{productInformation.productDescription.slice(0, 30)}</p>
          <Link to={`/view_product/${productInformation._id}`} className="btn btn-primary mt-2" style={{ borderColor: 'black', color: 'white', backgroundColor: 'lightnavy' }}>View more</Link>
          <button onClick={handleAddToCart} className="btn btn-primary mt-2">Add to Cart</button>
          <ToastContainer />
        </div>
      </div>

      <StyledModal
        title={productInformation.productName}
        visible={show}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
          <Button
            key="addToCart"
            type="primary"
            onClick={() => {
              handleAddToCart();
              handleClose();
            }}
          >
            Add to Cart
          </Button>,
          <Button
            key="addToFavorites"
            onClick={() => {
              addToFavourites();
              handleClose();
            }}
          >
            Add to Favorites
          </Button>,
          <Button key="buyNow" type="primary" danger onClick={handleBuyNowShow}>
            Buy Now
          </Button>,
        ]}
      >
        <Image
          src={`http://localhost:5000/products/${productInformation.productImage}`}
          alt={productInformation.productName}
          style={{ width: "100%", marginBottom: "16px" }}
        />
        <p>{productInformation.productDescription}</p>
        <PriceTag>Rs {productInformation.productPrice}</PriceTag>
      </StyledModal>

      <StyledModal
        title="Buy Now"
        visible={buyNowShow}
        onCancel={handleBuyNowClose}
        footer={[
          <Button key="close" onClick={handleBuyNowClose}>
            Close
          </Button>,
          <Button key="placeOrder" type="primary" onClick={placeOrder}>
            Place Order
          </Button>,
        ]}
      >
        <div style={{ display: "flex", marginBottom: "16px" }}>
          <Image
            src={`http://localhost:5000/products/${productInformation.productImage}`}
            alt={productInformation.productName}
            style={{ width: "100px", height: "100px", marginRight: "16px" }}
          />
          <div>
            <h4>{productInformation.productName}</h4>
            <p>{productInformation.productDescription}</p>
            <PriceTag>Rs {productInformation.productPrice} per unit</PriceTag>
          </div>
          </div>
        <Form layout="vertical">
          <Form.Item label="Quantity">
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="Address">
            <Input.TextArea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Payment Method">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Radio value="khalti">Khalti</Radio>
              <Radio value="cod">Cash on Delivery</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        <div style={{ marginTop: '16px' }}>
          <h4>Reviews:</h4>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} style={{ marginBottom: '8px' }}>
                <strong>{review.user.name}</strong>
                <p>{review.content}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </StyledModal>
    </>
  );
};

export default ProductCard;

       
