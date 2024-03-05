import React from "react";
import './card.css';

function ProductCard({ id, product, price, brand }) {
  return (
    <div className="product-card">
      <h3>ID: {id}</h3>
      <p>Название: {product}</p>
      <p>Цена: {price}</p>
      <p>Бренд: {brand || "Нет данных о бренде"}</p>
    </div>
  );
}

export default ProductCard;