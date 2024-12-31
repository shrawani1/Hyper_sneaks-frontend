
import { Skeleton, message } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getUserOrdersApi } from "../../apis/Api";

// Wrapper for the entire page with background image
const BackgroundWrapper = styled.div`
  background: url('https://images.unsplash.com/photo-1526415302530-ad8c7d818689?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
  padding: 2rem;
`;

const PageContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9); // Slightly transparent white background
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh; // Ensure it takes full height if content is short
`;

const Header = styled.h2`
  color: #1a237e;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
`;

const OrderCard = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const OrderId = styled.h3`
  color: #1a237e;
  font-size: 1.2rem;
  margin: 0;
`;

const Status = styled.span`
  background-color: ${(props) => {
    switch (props.status) {
      case "dispatched":
        return "#4caf50";
      case "pending":
        return "#ff9800";
      case "cancelled":
        return "#f44336";
      default:
        return "#2196f3";
    }
  }};
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.p`
  margin: 0;
  color: #424242;
  font-size: 0.9rem;
`;

const ItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Item = styled.li`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid #e0e0e0;
`;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrdersApi()
      .then((res) => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch orders");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <BackgroundWrapper>
        <PageContainer>
          <Header>Your Orders</Header>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 4 }} />
          ))}
        </PageContainer>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <PageContainer>
        <Header>Your Orders</Header>
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OrderHeader>
              <OrderId>Order ID: {order._id}</OrderId>
              <Status status={order.status}>{order.status}</Status>
            </OrderHeader>
            <OrderInfo>
              <InfoItem>
                <strong>Total:</strong> Rs. {order.total}
              </InfoItem>
              <InfoItem>
                <strong>Address:</strong> {order.address}
              </InfoItem>
              <InfoItem>
                <strong>Payment:</strong> {order.paymentType}
              </InfoItem>
              <InfoItem>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </InfoItem>
            </OrderInfo>
            <h4>Items:</h4>
            <ItemsList>
              {order.carts.map((item) => (
                <Item key={item._id}>
                  <p>
                    <strong>Product:</strong>{" "}
                    {item.productId ? item.productId.productName : "Unknown Product"}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> Rs. {item.total}
                  </p>
                  <p>
                    <strong>Status:</strong> {item.status}
                  </p>
                </Item>
              ))}
            </ItemsList>
          </OrderCard>
        ))}
      </PageContainer>
    </BackgroundWrapper>
  );
};

export default OrderList;
