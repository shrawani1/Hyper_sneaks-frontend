import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { Button, Modal, Image, Form, Input, Radio, Tooltip } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToCartApi, addToFavoriteApi, getReviewsApi, createOrderApi } from '../apis/Api';


const CardContainer = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const HeartButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  cursor: pointer;
`;

const CardContent = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const ProductTitle = styled.h5`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const ProductPrice = styled.h5`
  margin: 0;
  font-size: 16px;
  color: #d9534f;
`;

const Description = styled.p`
  margin: 10px 0;
  color: #666;
  font-size: 14px;
  flex-grow: 1;
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const ReviewsSection = styled.div`
  margin-top: 16px;
  font-size: 14px;
`;

// ProductCard Component
const ProductCard = ({ productInformation }) => {
  const [showModal, setShowModal] = useState(false);
  const [buyNowShow, setBuyNowShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reviews, setReviews] = useState([]);

  const totalPrice = productInformation.productPrice * quantity;

  // Fetch Reviews
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
  }, [productInformation._id]);

  const handleAddToCart = async () => {
    try {
      await addToCartApi({
        productId: productInformation._id,
        quantity: 1,
      });
      toast.success('Added to cart!');
    } catch {
      toast.error('Error adding to cart.');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await addToFavoriteApi({ productId: productInformation._id });
      toast.success('Added to favorites!');
    } catch {
      toast.error('Error adding to favorites.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!address || !paymentMethod) {
      toast.error('All fields are required.');
      return;
    }
    try {
      await createOrderApi({
        carts: [{ productId: productInformation._id, quantity }],
        address,
        totalAmount: totalPrice,
        paymentType: paymentMethod,
      });
      toast.success('Order placed successfully!');
      setBuyNowShow(false);
    } catch {
      toast.error('Failed to place order.');
    }
  };

  return (
    <CardContainer>
      <HeartButton onClick={handleAddToFavorites}>
        <HeartOutlined style={{ color: 'red', fontSize: '18px' }} />
      </HeartButton>
      <ProductImage
        src={`https://localhost:5000/products/${productInformation.productImage}`}
        alt={productInformation.productName}
        onClick={() => setShowModal(true)}
      />
      <CardContent>
        <TitleRow>
          <ProductTitle>{productInformation.productName}</ProductTitle>
          <ProductPrice>Rs {productInformation.productPrice}</ProductPrice>
        </TitleRow>
        <Description>{productInformation.productDescription.slice(0, 40)}...</Description>
        <ButtonRow>
          <Button icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button type="primary" danger onClick={() => setBuyNowShow(true)}>
            Buy Now
          </Button>
        </ButtonRow>
      </CardContent>

      {/* Modal for Details */}
      <Modal
        visible={showModal}
        title={productInformation.productName}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Image
          src={`https://localhost:5000/products/${productInformation.productImage}`}
          alt={productInformation.productName}
          style={{ width: '100%' }}
        />
        <p>{productInformation.productDescription}</p>
        <h5>Price: Rs {productInformation.productPrice}</h5>
        <ReviewsSection>
          <h6>Reviews:</h6>
          {reviews.length > 0
            ? reviews.map((review) => (
                <div key={review._id}>
                  <strong>{review.user.name}</strong>
                  <p>{review.content}</p>
                </div>
              ))
            : 'No reviews yet.'}
        </ReviewsSection>
      </Modal>

      {/* Buy Now Modal */}
      <Modal
        title="Buy Now"
        visible={buyNowShow}
        onCancel={() => setBuyNowShow(false)}
        footer={[
          <Button key="cancel" onClick={() => setBuyNowShow(false)}>
            Cancel
          </Button>,
          <Button key="order" type="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>,
        ]}
      >
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
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} />
    </CardContainer>
  );
};

export default ProductCard;
