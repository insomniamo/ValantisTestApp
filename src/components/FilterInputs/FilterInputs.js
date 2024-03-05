import React from "react";
import "./filterinputs.css";

export default function FilterInputs({ filter, onInputChange }) {
  return (
    <div className="filter-list">
      <input
        className="input-item"
        type="text"
        placeholder="Название"
        name="name"
        value={filter.name}
        onChange={onInputChange}
      />
      <input
        className="input-item"
        type="number"
        placeholder="Цена"
        name="price"
        value={filter.price}
        onChange={onInputChange}
      />
      <input
        className="input-item"
        type="text"
        placeholder="Бренд"
        name="brand"
        value={filter.brand}
        onChange={onInputChange}
      />
    </div>
  );
}
