import React, { useEffect, useState } from "react";
import { Skeleton, message } from "antd";
import { motion } from "framer-motion";
import styled from "styled-components";
import { getUserOrdersApi } from "../../apis/Api";

// ===== Styled Components =====

const Wrapper = styled.div`
  background: linear-gradient(135deg, #e0eafc, #f8f8f8;);
  min-height: 100vh;
  padding: 40px 20px;
  margin-top: 50px;
`;

const Container = styled.div`
  background: #ffffff;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Header = styled.h2`
  color: #333;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const OrderCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
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
  color: #fff;
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
  font-size: 0.9rem;
  color: #424242;
`;

const ItemsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const OrderItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
`;

// ===== OrderList Component =====

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
      <Wrapper>
        <Container>
          <Header>Your Orders</Header>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 4 }} />
          ))}
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
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
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
              </InfoItem>
            </OrderInfo>
            <h4>Items:</h4>
            <ItemsList>
              {order.carts.map((item) => (
                <OrderItem key={item._id}>
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
                </OrderItem>
              ))}
            </ItemsList>
          </OrderCard>
        ))}
      </Container>
    </Wrapper>
  );
};

export default OrderList;
