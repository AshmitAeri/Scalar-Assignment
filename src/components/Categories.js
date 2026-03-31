import React from "react";
import "./Categories.css";

function Categories({ setCategory }) {
  const items = [
    { name: "Grocery", img: "https://rukminim1.flixcart.com/flap/64/64/image/29327f40e9c4d26b.png" },
    { name: "Mobiles", img: "https://rukminim1.flixcart.com/flap/64/64/image/22fddf3c7da4c4f4.png" },
    { name: "Fashion", img: "https://rukminim1.flixcart.com/flap/64/64/image/0d75b34f7d8fbcb3.png" },
    { name: "Electronics", img: "https://rukminim1.flixcart.com/flap/64/64/image/69c6589653afdb9a.png" },
    { name: "Home", img: "https://cdn-icons-png.flaticon.com/512/25/25694.png" },
    { name: "Appliances", img: "https://rukminim1.flixcart.com/flap/64/64/image/0ff199d1bd27eb98.png" },
    { name: "Travel", img: "https://rukminim1.flixcart.com/flap/64/64/image/71050627a56b4693.png" },
    { name: "Beauty", img: "https://www.conceptsnc.com/wp-content/uploads/2024/02/studio-concept-agenzia-comunicazione-specilizzata-cosmetici-beauty-agency-milano-servizi-still-life.webp" },
  ];

  return (
    <div className="categories">
      {items.map((item, index) => (
        <div className="category" key={index} onClick={() => setCategory(item.name)}>
          <img src={item.img} alt={item.name} />
          <p>{item.name}</p>
        </div>
        
      ))}
    </div>
  );
}

export default Categories;