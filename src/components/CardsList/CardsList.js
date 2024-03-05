import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Card/Card";
import FilterInputs from "../FilterInputs/FilterInputs";
import generateXAuth from "../../utils/pass";
import "./cardslist.css";

export default function CardsList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState({
    name: "",
    price: "",
    brand: "",
  });

  useEffect(() => {
    fetchData();
  }, [offset, filter]);

  const fetchData = async () => {
    try {
      const xAuth = generateXAuth();
      let uniqueProducts = {};
      let uniqueProductsArray = [];

      let fetchOffset = offset;
      let fetchLimit = 100;

      while (uniqueProductsArray.length < 50) {
        const responseIds = await axios.post(
          "https://api.valantis.store:41000/",
          {
            action: "get_ids",
            params: { offset: fetchOffset, limit: fetchLimit },
          },
          {
            headers: {
              "X-Auth": xAuth,
            },
          }
        );
        const ids = responseIds.data.result;

        if (ids.length === 0) {
          break;
        }

        const uniqueIds = Array.from(new Set(ids));

        const responseProducts = await axios.post(
          "https://api.valantis.store:41000/",
          {
            action: "get_items",
            params: { ids: uniqueIds },
          },
          {
            headers: {
              "X-Auth": xAuth,
            },
          }
        );

        responseProducts.data.result.forEach((product) => {
          if (!uniqueProducts[product.id]) {
            uniqueProducts[product.id] = product;
          }
        });

        uniqueProductsArray = Object.values(uniqueProducts).slice(0, 50);

        fetchOffset += ids.length;
        fetchLimit = 100;
      }

      // Apply filtering
      let filteredProducts = uniqueProductsArray.filter((product) => {
        return (
          (!filter.name || product.product.includes(filter.name)) &&
          (!filter.price || product.price === Number(filter.price)) &&
          (!filter.brand || product.brand === filter.brand)
        );
      });

      setProducts(filteredProducts);
      setError(null);
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
      setError(error);

      // Повторный запрос в случае ошибки 500
      if (error.response && error.response.status === 500) {
        console.log("Ошибка 500, выполняем повторный запрос...");
        fetchData(); // Повторный вызов fetchData
      }
    }
  };

  const handleNextPage = () => {
    setOffset(offset + 50);
  };

  const handlePrevPage = () => {
    if (offset >= 50) {
      setOffset(offset - 50);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="products-container">
      {error && <p>Произошла ошибка: {error.message}</p>}
      <FilterInputs filter={filter} onInputChange={handleInputChange} />
      <div className="product-list">
        {products.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            product={product.product}
            price={product.price}
            brand={product.brand}
          />
        ))}
      </div>
      <div className="pagination-buttons">
        <button
          className="pagination-item"
          onClick={handlePrevPage}
          disabled={offset === 0}
          style={{
            cursor: offset === 0 ? "not-allowed" : "pointer",
            color: offset === 0 ? "#bfcbe0" : "white",
          }}
        >
          Назад
        </button>
        <button className="pagination-item" onClick={handleNextPage}>
          Вперед
        </button>
      </div>
    </div>
  );
}
