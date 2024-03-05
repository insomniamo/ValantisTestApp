import React, { useState } from "react";
import "./filterinputs.css";

export default function FilterInputs({ filter, onInputChange, onSearch }) {
  const [inputValues, setInputValues] = useState({
    name: filter.name,
    price: filter.price,
    brand: filter.brand,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSearchClick = (name) => {
    onInputChange(name, inputValues[name]);
    onSearch();
  };

  const handleInputFocus = (name) => {
    // Очистка остальных инпутов, кроме того, на котором произошла фокусировка
    const newInputValues = {};
    Object.keys(inputValues).forEach((key) => {
      newInputValues[key] = key === name ? inputValues[key] : "";
    });
    setInputValues(newInputValues);
  };

  return (
    <div className="filter-list">
      <div className="input-container">
        <input
          className="input-item"
          type="text"
          placeholder="Название"
          name="name"
          value={inputValues.name}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("name")}
        />
        <button
          className="search-button"
          onClick={() => handleSearchClick("name")}
        >
          Поиск
        </button>
      </div>
      <div className="input-container">
        <input
          className="input-item"
          type="number"
          placeholder="Цена"
          name="price"
          value={inputValues.price}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("price")}
        />
        <button
          className="search-button"
          onClick={() => handleSearchClick("price")}
        >
          Поиск
        </button>
      </div>
      <div className="input-container">
        <input
          className="input-item"
          type="text"
          placeholder="Бренд"
          name="brand"
          value={inputValues.brand}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("brand")}
        />
        <button
          className="search-button"
          onClick={() => handleSearchClick("brand")}
        >
          Поиск
        </button>
      </div>
    </div>
  );
}
