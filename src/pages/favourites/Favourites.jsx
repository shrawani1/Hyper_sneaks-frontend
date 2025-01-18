import React, { useEffect, useState } from "react";
import { DeleteOutlined, HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Image, message, Skeleton } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  addToCartApi,
  deleteFromFavoriteApi,
  getFavoriteByUserApi,
} from "../../apis/Api";

// Wrapper to prevent content from being hidden behind the navbar.
const Wrapper = styled.div`
  background: #f0f2f5;
  min-height: calc(100vh - 80px);
  padding: 20px;
  margin-top: 80px; 
`;

// Main container for the favourites section
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// Title styling with an icon
const Title = styled.h2`
  font-size: 1.75rem;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin-right: 10px;
  }
`;

// Grid layout for the product cards
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

// Individual product card styling
const Card = styled(motion.div)`
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

// Wrapper for the product image
const CardImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

// Ensuring the image covers the area without distortion
const CardImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Container for the product details
const CardContent = styled.div`
  padding: 15px;
`;

// Product name styling
const ProductName = styled.h3`
  font-size: 1.1rem;
  color: #444;
  margin: 0 0 10px;
`;

// Product price styling
const ProductPrice = styled.p`
  font-size: 1rem;
  color: #e74c3c;
  margin: 0 0 15px;
  font-weight: bold;
`;

// Button group for action buttons
const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

// Styling for empty state when there are no favourites
const EmptyState = styled.div`
  text-align: center;
  color: #666;
  padding: 40px;
  font-size: 1.2rem;
`;

// Custom styled buttons

const BuyNowButton = styled(Button)`
  background-color: #febd69 !important;
  border-color: #febd69 !important;
  color: #fff !important;
  &:hover,
  &:focus {
    background-color: #febd69 !important;
    border-color: #febd69 !important;
    opacity: 0.9;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #014296 !important;
  border-color: #014296 !important;
  color: #fff !important;
  &:hover,
  &:focus {
    background-color: #014296 !important;
    border-color: #014296 !important;
    opacity: 0.9;
  }
`;

const Favourites = () => {
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState([]);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getFavoriteByUserApi()
      .then((res) => {
        setFavourites(res.data.favorites || []);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      });
  }, [reload]);

  const handleDeleteFavourite = (id) => {
    if (!id) {
      message.error("Invalid item selected.");
      return;
    }
    deleteFromFavoriteApi(id)
      .then(() => {
        message.success("Removed from favourites");
        setReload((prev) => !prev);
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Something went wrong");
      });
  };

  const handleAddToCart = async (productId, productPrice) => {
    if (!productId) {
      message.error("Invalid product selected.");
      return;
    }
    try {
      // Assuming a quantity of 1
      const total = productPrice;
      await addToCartApi({ productId, quantity: 1, total });
      message.success("Added to cart!");
      navigate("/my_cart");
    } catch (error) {
      message.error("Failed to add to cart.");
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <Container>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 3 }} />
          ))}
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Title>
          <HeartOutlined /> Your Favourites
        </Title>
        {favourites.length === 0 ? (
          <EmptyState>
            <HeartOutlined style={{ fontSize: "3rem", marginBottom: "1rem" }} />
            <p>Your favourites list is empty. Start adding some!</p>
          </EmptyState>
        ) : (
          <CardGrid>
            <AnimatePresence>
              {favourites.map((fav, index) => {
                const product = fav?.productId;
                if (!product) return null;
                return (
                  <Card
                    key={fav._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CardImageWrapper>
                      <CardImage
                        preview={false}
                        src={`https://localhost:5000/products/${
                          product.productImage || "default.jpg"
                        }`}
                        alt={product.productName || "Product"}
                      />
                    </CardImageWrapper>
                    <CardContent>
                      <ProductName>
                        {product.productName || "Unknown Product"}
                      </ProductName>
                      <ProductPrice>
                        Rs. {product.productPrice || 0}
                      </ProductPrice>
                      <ButtonGroup>
                        <BuyNowButton
                          onClick={() =>
                            handleAddToCart(
                              product._id,
                              product.productPrice || 0
                            )
                          }
                        >
                          Buy Now
                        </BuyNowButton>
                        <RemoveButton
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteFavourite(fav._id)}
                        >
                          Remove
                        </RemoveButton>
                      </ButtonGroup>
                    </CardContent>
                  </Card>
                );
              })}
            </AnimatePresence>
          </CardGrid>
        )}
      </Container>
    </Wrapper>
  );
};

export default Favourites;
