import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Card/Card";
import FilterInputs from "../FilterInputs/FilterInputs";
import generateXAuth from "../../utils/pass";
import "./cardslist.css";

export default function CardsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
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
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
      setError(error);
      setLoading(false);
      if (error.response && error.response.status === 500) {
        console.log("Ошибка 500, выполняем повторный запрос...");
        fetchData();
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

  const handleInputChange = (name, value) => {
    setFilter(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    if (Object.values(filter).some((v) => v !== "")) {
      handleSearch();
    }
  }, [filter]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const xAuth = generateXAuth();
      // Формирование тела запроса с параметрами фильтра
      const params = {};
  
      // Проверяем, заполнено ли поле фильтрации и добавляем его в параметры запроса
      if (filter.name.trim() !== "") {
        params.product = filter.name.trim();
      }
      if (filter.price.trim() !== "") {
        params.price = Number(filter.price.trim());
      }
      if (filter.brand.trim() !== "") {
        params.brand = filter.brand.trim();
      }
  
      const requestBody = {
        action: "filter",
        params: params,
      };
  
      console.log("Request body:", requestBody); // Выводим тело запроса в консоль
  
      // Отправка POST-запроса к API
      const response = await axios.post(
        "https://api.valantis.store:41000/",
        requestBody,
        {
          headers: { "X-Auth": xAuth },
        }
      );
      // Проверка наличия ключа 'result' в ответе
      if (response.data && response.data.result) {
        const ids = response.data.result;
        if (ids.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }
        // Получение детальной информации о продуктах для полученных ID
        const productsData = await axios.post(
          "https://api.valantis.store:41000/",
          {
            action: "get_items",
            params: { ids: ids },
          },
          {
            headers: { "X-Auth": xAuth },
          }
        );
        // Обновление состояния с полученными продуктами
        setProducts(productsData.data.result);
      } else {
        // Обработка ошибки, если ключ 'result' отсутствует в ответе
        throw new Error("Неверный формат ответа");
      }
    } catch (error) {
      console.error("Произошла ошибка во время поиска:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-container">
      {error && <p>Произошла ошибка: {error.message}</p>}
      <FilterInputs
        filter={filter}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
      />
      {loading ? (
        <p>Загрузка...</p>
      ) : (
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
      )}
      <div className="pagination-buttons">
        <button
          className="pagination-item"
          onClick={handlePrevPage}
          disabled={offset === 0}
          style={{
            cursor: offset === 0 ? "not-allowed" : "pointer",
            color: "#8591A5",
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
