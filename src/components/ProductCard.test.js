// ProductCard.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "./ProductCard";
import { addToCartApi, addToFavoriteApi } from "../apis/Api";
import { toast } from "react-toastify";

// Mock API functions
jest.mock("../apis/Api", () => ({
  addToCartApi: jest.fn(),
  getReviewsApi: jest.fn(),
  addToFavoriteApi: jest.fn(),
  createOrderApi: jest.fn(),
}));

// Mock Toast functions
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

const productInformation = {
  _id: "1",
  productName: "Test Product",
  productPrice: 100,
  productImage: "test-image.jpg",
  productDescription: "This is a test product.",
  productCategory: "Test Category",
};

describe("ProductCard Component Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should navigate to product details page on 'View more' button click", () => {
    render(
      <BrowserRouter>
        <ProductCard productInformation={productInformation} color="blue" />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/View more/i));

    // Assuming the button navigates to /view_product/:id
    expect(window.location.pathname).toBe(`/view_product/${productInformation._id}`);
  });

  it("should call addToCartApi and show success toast on 'Add to Cart' button click", async () => {
    addToCartApi.mockResolvedValue({});

    render(
      <BrowserRouter>
        <ProductCard productInformation={productInformation} color="blue" />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Add to Cart/i));

    await waitFor(() => {
      expect(addToCartApi).toHaveBeenCalledWith({
        productId: productInformation._id,
        quantity: 1,
        total: productInformation.productPrice,
      });
      expect(toast.success).toHaveBeenCalledWith("Added to cart successfully!");
    });
  });

  
});
