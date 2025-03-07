

import React, { useEffect, useState } from "react";
import {
  CreditCardOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Image, Input, message, Radio, Skeleton } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import KhaltiCheckout from "khalti-checkout-web";
import { CountUp } from "use-count-up";
import {
  createOrderApi,
  deleteCartApi,
  getAllCartApi,
  updateCartApi,
  updateCartStatusApi,
} from "../../apis/Api";
import "./MyCart.css";

const Cart = () => {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [deliveryCharge] = useState(50);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const handleQuantityChange = (value, cart) => {
    if (value < 1) return;
    const updatedCart = cartItems.map((item) =>
      item._id === cart._id
        ? { ...item, quantity: value, total: item.productId.productPrice * value }
        : item
    );
    setCartItems(updatedCart);

    updateCartApi(cart._id, {
      quantity: value,
      total: cart.productId.productPrice * value,
    })
      .then(() => message.success("Quantity updated"))
      .catch((err) => message.error(err.response?.data?.message || "Error updating cart"));
  };

  const handleDeleteCartItem = (id) => {
    deleteCartApi(id)
      .then(() => {
        setCartItems(cartItems.filter((item) => item._id !== id));
        message.success("Item removed");
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Error removing item");
      });
  };

  useEffect(() => {
    getAllCartApi()
      .then((res) => {
        setCartItems(res.data.carts);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [refresh]);

  useEffect(() => {
    const st = cartItems.reduce((acc, item) => acc + item.total, 0);
    setSubTotal(st);
    setTotal(st + deliveryCharge);
  }, [cartItems, deliveryCharge]);

  const khaltiConfig = {
    publicKey: "test_public_key_0e1cf205988d4124b151e7a0288cefa4",
    productIdentity: "cart_order",
    productName: "Your Cart",
    productUrl: "https://localhost:3000/cart",
    paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    eventHandler: {
      onSuccess(payload) {
        handlePayment();
        message.success("Payment successful");
      },
      onError(error) {
        message.error("Payment failed");
      },
      onClose() {
        console.log("Khalti widget closed");
      },
    },
  };

  const handleKhaltiPayment = () => {
    if (!address.trim()) {
      message.error("Please enter your address");
      return;
    }
    const checkout = new KhaltiCheckout(khaltiConfig);
    checkout.show({ amount: total });
  };

  const handlePayment = () => {
    const data = {
      address,
      carts: cartItems,
      totalAmount: total,
      paymentType: paymentMethod,
    };
    createOrderApi(data)
      .then(() => {
        updateCartStatusApi({ status: "ordered" }).then(() => setRefresh(!refresh));
        message.success("Order placed");
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Order failed");
      });
  };

  const handleBuyNow = () => {
    if (!address.trim()) {
      message.error("Please enter your address");
      return;
    }
    if (paymentMethod === "Khalti") {
      handleKhaltiPayment();
    } else {
      handlePayment();
    }
  };

  if (loading) {
    return (
      <div className="cart-wrapper">
        <div className="cart-container">
          <div className="cart-items-section">
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} active avatar paragraph={{ rows: 3 }} />
            ))}
          </div>
          <div className="cart-summary-section">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <div className="cart-header">
          <ShoppingCartOutlined /> My Shopping Cart
        </div>
        {cartItems.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items-section">
              <AnimatePresence>
                {cartItems.map((cart, index) => (
                  <motion.div
                    className="cart-item"
                    key={cart._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="item-image">
                      <Image
                        preview={false}
                        src={`https://localhost:5000/products/${cart.productId?.productImage || "default.jpg"}`}
                        alt={cart.productId?.productName || "Product"}
                      />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">
                        {cart.productId?.productName || "Unnamed Product"}
                      </h3>
                      <p className="item-desc">
                        {cart.productId?.productDescription || "No description available."}
                      </p>
                      <p className="item-price">Rs. {cart.productId?.productPrice || 0}</p>
                      <div className="quantity-control">
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => handleQuantityChange(cart.quantity - 1, cart)}
                        />
                        <Input
                          value={cart.quantity}
                          onChange={(e) => handleQuantityChange(Number(e.target.value), cart)}
                        />
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => handleQuantityChange(cart.quantity + 1, cart)}
                        />
                      </div>
                      <p className="item-total">
                        Total: Rs. <CountUp isCounting end={cart.total} duration={1} />
                      </p>
                    </div>
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteCartItem(cart._id)}
                      className="delete-btn"
                    >
                      Delete
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="cart-summary-section">
              <div className="summary-card">
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>
                    Rs. <CountUp isCounting end={subTotal} duration={1} />
                  </span>
                </div>
                <div className="summary-item">
                  <span>Delivery Charge:</span>
                  <span>Rs. {deliveryCharge}</span>
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <span>
                    Rs. <CountUp isCounting end={total} duration={1} />
                  </span>
                </div>
              </div>
              <Input
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="address-input"
              />
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                className="payment-options"
              >
                <Radio value="Khalti">
                  <img src="assets/images/khalti.png" alt="Khalti" className="payment-logo" /> Khalti
                </Radio>
                <Radio value="Cash On Delivery">
                  <img src="assets/images/cod.png" alt="COD" className="payment-logo" /> Cash On Delivery
                </Radio>
              </Radio.Group>
              <Button
                type="primary"
                icon={<CreditCardOutlined />}
                size="large"
                onClick={handleBuyNow}
                className="order-btn"
              >
                Place Order
              </Button>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <ShoppingCartOutlined />
            <p>Your cart is empty. Start shopping now!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
