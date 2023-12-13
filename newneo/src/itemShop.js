import React, { useState, useEffect } from 'react';
import './ItemShop.css';

const ItemShop = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/items')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleBuyClick = (itemId) => {
        // Implement logic to handle the buy button click
        console.log(`Buy button clicked for item ${itemId}`);
    };

    return (
        <div className={"background"}>
            <h2>Item Shop</h2>
            <div className="item-grid">
                {items.map(item => (
                    <div key={item.id} className="item-card">
                        <h3>{item.item_name}</h3>
                        <img src={item.item_photo} alt={item.item_name} className="item-image" />
                        <p>Price: ${item.price}</p>
                        <button className="buy-button" onClick={() => handleBuyClick(item.id)}>
                            Buy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemShop;
