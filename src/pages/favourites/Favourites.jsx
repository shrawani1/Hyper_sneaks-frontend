import { DeleteOutlined, HeartOutlined } from "@ant-design/icons";
import { Button, Image, message, Skeleton } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { addToCartApi, deleteFromFavoriteApi, getFavoriteByUserApi } from "../../apis/Api";

const BackgroundWrapper = styled.div`
  background: url('https://images.unsplash.com/photo-1526415302530-ad8c7d818689?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') no-repeat center center;
  background-size: cover;
  min-height: 100vh; /* Adjust as needed */
  padding: 2rem;
`;

const FavouritesContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8f9fa; /* Background color for the container */
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const FavouriteItem = styled(motion.div)`
  display: flex;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  margin-left: 1.5rem;
`;

const ItemName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const ItemPrice = styled.p`
  font-weight: bold;
  color: #e74c3c;
  font-size: 1.1rem;
`;

const EmptyFavouritesMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const Favourites = () => {
  const [loading, setLoading] = useState(true);
  const [favouriteItems, setFavouriteItems] = useState([]);
  const [changefav, setChangeFav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, [changefav]);

  const fetchFavorites = () => {
    getFavoriteByUserApi()
      .then((res) => {
        setFavouriteItems(res.data.favorites || []);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      });
  };

  const handleDeleteFavourite = (favouriteId) => {
    if (!favouriteId) {
      message.error("Invalid item selected for removal.");
      return;
    }

    deleteFromFavoriteApi(favouriteId)
      .then(() => {
        setChangeFav(!changefav);
        message.success("Item removed from favourites");
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
      const total = 1 * productPrice; // Assuming quantity is 1

      await addToCartApi({ productId, quantity: 1, total });
      message.success("Added to cart successfully!");
      navigate("/my_cart");
    } catch (error) {
      message.error("Failed to add to cart.");
    }
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <FavouritesContainer>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 3 }} />
          ))}
        </FavouritesContainer>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <FavouritesContainer>
        <h2>
          <HeartOutlined /> Your Favourites
        </h2>
        <AnimatePresence>
          {favouriteItems.length > 0 ? (
            favouriteItems.map((item, index) => {
              const product = item?.productId;
              if (!product) return null;

              return (
                <FavouriteItem
                  key={item._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Image
                    width={150}
                    src={`http://localhost:5000/products/${product.productImage || "default.jpg"}`}
                    alt={product.productName || "Product"}
                  />
                  <ItemDetails>
                    <ItemName>{product.productName || "Unknown Product"}</ItemName>
                    <ItemPrice>Rs. {product.productPrice || 0}</ItemPrice>
                    <Button
                      type="primary"
                      onClick={() => handleAddToCart(product._id, product.productPrice || 0)}
                      style={{ marginTop: "1rem" }}
                    >
                      Buy Now
                    </Button>
                  </ItemDetails>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteFavourite(item._id)}
                  >
                    Remove
                  </Button>
                </FavouriteItem>
              );
            })
          ) : (
            <EmptyFavouritesMessage>
              <HeartOutlined style={{ fontSize: 50, marginBottom: "1rem" }} />
              <p>Your favourites list is empty. Start adding items now!</p>
            </EmptyFavouritesMessage>
          )}
        </AnimatePresence>
      </FavouritesContainer>
    </BackgroundWrapper>
  );
};

export default Favourites;
