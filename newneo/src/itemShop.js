import React, { useState, useEffect } from 'react';
import './ItemShop.css';

const ItemShop = ({ user }) => {
    const [items, setItems] = useState([]);
    const [purchaseStatus, setPurchaseStatus] = useState(null);

    useEffect(() => {
        console.log('User ID:', user?.id);
        // Fetch items
        fetch('http://localhost:5000/api/items', {
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [user]);

    const handleBuyClick = async (itemId) => {
        try {
            // Check if the user ID is available before making a purchase
            console.log('User ID:', user?.id);
            console.log('Item clicked:', itemId);
            if (!user?.id) {
                console.error('User ID not available to make a purchase.');
                return;
            }

            const response = await fetch('http://localhost:5000/api/buy-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user?.id,
                    itemId,
                }),
                credentials: 'include',
            }).catch(error => console.error('Fetch error:', error));

            if (!response.ok) {
                const result = await response.json();
             if (result.error === 'Insufficient neopoints to buy the item.') {
                // Handle insufficient neopoints error
                console.error('Insufficient neopoints to buy the item.');
                setPurchaseStatus('Insufficient neopoints to buy the item.');
            } else if (result.error === 'Item already exists in the inventory.') {
                // Handle item already exists error
                console.error('Item already exists in the inventory.');
                setPurchaseStatus('Item already exists in the inventory.');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }
            const result = await response.json();
            console.log(result.message);

            

        // Update purchase status state
        setPurchaseStatus(result.message);

        // Clear purchase status after a delay (adjust the timeout as needed)
        setTimeout(() => {
            setPurchaseStatus(null);
        }, 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error('Error buying item:', error.message);
        }
    };

    return (
        <div className={"background"}>
            <h2>Item Shop</h2>
{/* Display purchase status message */}
{purchaseStatus && (
                <div className="purchase-status">
                    {purchaseStatus === 'Item purchased successfully!' ? (
                        <span className="success-message">{purchaseStatus}</span>
                    ) : (
                        <span className="error-message">{purchaseStatus}</span>
                    )}
                </div>
            )}

            <div className="item-grid">
            {items.map(item => (
                <div key={item.id} className="item-card">
                    <h3>{item.item_name}</h3>
                    <img src={item.item_photo} alt={item.item_name} className="item-image" />
                    <p>Price: ${item.price}</p>
                    <button className="buy-button" onClick={() => handleBuyClick(item.item_id)}>
                        Buy
                    </button>
                </div>
            ))}
            </div>
            
        </div>
    );
};

export default ItemShop;
