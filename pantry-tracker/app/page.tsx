"use client";

// pages/index.js or pages/index.tsx
import { useState, useEffect } from 'react';
import { db, ref, set, get, update, remove, child } from '../lib/firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    loadItemsFromFirebase();
  }, []);

  const loadItemsFromFirebase = async () => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, 'items'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const itemsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setItems(itemsList);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error loading items from Firebase:", error);
    }
  };

  const handleAddNewItem = () => {
    setIsPopupOpen(true);
  };

  const handleAddItem = async () => {
    if (!newItemName) {
      alert("Item name cannot be empty");
      return;
    }
    try {
      const newItemRef = ref(db, 'items/' + Date.now());
      const newItem = { name: newItemName, quantity: 0 };
      await set(newItemRef, newItem);
      setItems([...items, { id: newItemRef.key, ...newItem }]);
      setNewItemName('');
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
  };

  const handleQuantityChange = async (index, delta) => {
    try {
      const item = items[index];
      const newQuantity = item.quantity + delta;
      if (newQuantity < 0) return;

      const updatedItem = { ...item, quantity: newQuantity };
      const itemRef = ref(db, 'items/' + item.id);
      await update(itemRef, { quantity: newQuantity });

      const newItems = items.map((itm, idx) => idx === index ? updatedItem : itm);
      setItems(newItems);
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleDeleteItem = async (index) => {
    try {
      const item = items[index];
      const itemRef = ref(db, 'items/' + item.id);
      await remove(itemRef);

      const newItems = items.filter((_, idx) => idx !== index);
      setItems(newItems);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <AddButtons onAddNewItem={handleAddNewItem} />
        <br />
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <div className="flex-container">
                    <button
                      className="small-button"
                      onClick={() => handleQuantityChange(index, -1)}
                    >
                      -
                    </button>
                    <span> {item.quantity} </span>
                    <button
                      className="small-button"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      +
                    </button>
                    <span> </span>
                    <button
                      className="button delete"
                      onClick={() => handleDeleteItem(index)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="save-button"> Save Changes </button>

        {isPopupOpen && (
          <div className="popup">
            <div className="popup-content">
              <h3 style={{ fontWeight: "bold" }}>Add New Item</h3>
              <br />
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter Item Name"
                style={{ padding: "10px", border: "3px solid black" }}
              />
              <div>
                <button onClick={handleAddItem} style={{ backgroundColor: "rgb(97, 183, 122)" }} className='pop-up-button'>Add</button>
                <span> </span>
                <button onClick={handleCancel} style={{ backgroundColor: "red" }} className='pop-up-button'>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer></footer>
    </div>
  );
}

function Header() {
  return (
    <header>
      <p className="right-text">Pantry Tracking Application</p>
    </header>
  );
}

function AddButtons({ onAddNewItem }) {
  return (
    <div className="add-remove-buttons">
      <button className="button add" onClick={onAddNewItem}>Add New Item</button>
    </div>
  );
}
