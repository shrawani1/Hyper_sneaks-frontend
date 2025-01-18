import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { productPagination, productCount } from "../../apis/Api";
import "./Dashboard.css";
import Footer from "../../components/Footer";

const Dashboard = () => {
  // Brand-new state names
  const [shoeCollection, setShoeCollection] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [maxIndex, setMaxIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [priceSorting, setPriceSorting] = useState("asc");

  const limitPerPage = 10; // items per page

  // Retrieve total item count -> set maxIndex
  const getTotalShoes = () => {
    productCount()
      .then((res) => {
        const totalShoes = res.data.productCount;
        setMaxIndex(Math.ceil(totalShoes / limitPerPage));
      })
      .catch((err) => console.error(err));
  };

  // Retrieve product data
  const fetchShoeData = (page, query, sort) => {
    productPagination(page, limitPerPage, query, sort)
      .then((res) => {
        setShoeCollection(res.data.products);
      })
      .catch((err) => console.error(err));
  };

  // On mount & whenever currentIndex/searchInput/priceSorting changes
  useEffect(() => {
    getTotalShoes();
    fetchShoeData(currentIndex, searchInput, priceSorting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, searchInput, priceSorting]);

  // Page navigation
  const handleIndexChange = (pageNum) => {
    setCurrentIndex(pageNum);
  };

  // Optional search
  const initiateSearch = () => {
    setCurrentIndex(1);
    fetchShoeData(1, searchInput, priceSorting);
  };

  // Sort order
  const changeSorting = (order) => {
    setPriceSorting(order);
    setCurrentIndex(1);
    fetchShoeData(1, searchInput, order);
  };

  return (
    <div className="fullpage-wrapper">
      {/* ========== FULL-SCREEN HERO ========== */}
      <header className="fullscreen-hero">
        <div className="hero-content">
          <h1 className="hero-heading">Step Up Your Style</h1>
          <p className="hero-subheading">
          Lightweight, durable, and stylish shoes for every occasion.
          </p>
          <button
            className="hero-cta"
            onClick={() =>
              window.scrollTo({
                top: 600,
                behavior: "smooth",
              })
            }
          >
            Explore Now
          </button>
        </div>
      </header>

      {/* ========== FLOATING SEARCH & SORT PANEL ========== */}
      <section className="lens-panel">
        <div className="lens-inner">
          {/* Optional Search */}
          {/*
          <div className="lens-search">
            <input
              type="text"
              placeholder="Search shoes..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={initiateSearch}>Search</button>
          </div>
          */}
          <div className="lens-sort">
            <span className="lens-label">Sort by Price:</span>
            <button
              className={`sort-pick ${
                priceSorting === "asc" ? "sort-active" : ""
              }`}
              onClick={() => changeSorting("asc")}
            >
              Low to High
            </button>
            <button
              className={`sort-pick ${
                priceSorting === "desc" ? "sort-active" : ""
              }`}
              onClick={() => changeSorting("desc")}
            >
              High to Low
            </button>
          </div>
        </div>
      </section>

      {/* ========== PRODUCT GRID ========== */}
      <section className="glass-grid">
        {shoeCollection.map((item) => (
          
            <ProductCard key={item._id} productInformation={item}  />
          
        ))}
      </section>

      {/* ========== PAGINATION ========== */}
      <nav className="paging-row">
        <button
          disabled={currentIndex === 1}
          onClick={() => handleIndexChange(1)}
          className="paging-btn"
        >
          First
        </button>
        <button
          disabled={currentIndex === 1}
          onClick={() => handleIndexChange(currentIndex - 1)}
          className="paging-btn"
        >
          Prev
        </button>
        {Array.from({ length: maxIndex }, (_, i) => (
          <button
            key={i}
            className={`paging-btn ${currentIndex === i + 1 ? "page-active" : ""}`}
            onClick={() => handleIndexChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentIndex === maxIndex}
          onClick={() => handleIndexChange(currentIndex + 1)}
          className="paging-btn"
        >
          Next
        </button>
        <button
          disabled={currentIndex === maxIndex}
          onClick={() => handleIndexChange(maxIndex)}
          className="paging-btn"
        >
          Last
        </button>
      </nav>

      <Footer />
    </div>
  );
};

export default Dashboard;
