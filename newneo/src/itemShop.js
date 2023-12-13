import React, { useState, useEffect } from 'react';
import './ItemShop.css';

const ItemShop = () => {
    const [items, setItems] = useState([]);
    const [user_id, setUserId] = useState(null);

    useEffect(() => {
        // Fetch user ID from the server-side when the component mounts
        fetch('http://localhost:5000/api/buy-item', {
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.user_id) {
                    setUserId(data.user_id);
                } else {
                    console.error('User ID not available.');
                }
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                console.error('Response text:', error.response?.text); // Log the response text
            });

        // Fetch items
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

    const handleBuyClick = async (itemId) => {
        try {
            // Check if the user ID is available before making a purchase
            if (!user_id) {
                console.error('User ID not available to make a purchase.');
                return;
            }

            const response = await fetch('http://localhost:5000/api/buy-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error buying item:', error.message);
        }
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
