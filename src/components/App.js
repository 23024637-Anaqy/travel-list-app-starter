import React, { useState } from "react";

function Logo() {
  return <h1>My Travel List</h1>;
}

function Form({ handleAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("General");

  function handleSubmit(e) {
    e.preventDefault();

    const newItem = {
      id: Date.now(),
      description: description.trim(),
      quantity,
      category,
      packed: false,
    };

    if (!newItem.description) {
      alert("Description cannot be empty!");
      return;
    }

    handleAddItems(newItem);
    setDescription("");
    setQuantity(1);
    setCategory("General");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need to pack?</h3>
      <label>
        Category:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Clothes">Clothes</option>
          <option value="Toiletries">Toiletries</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="General">General</option>
        </select>
      </label>
      <label>
        Quantity:
        <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function Item({ item, handleDeleteItem, handleUpdateItem }) {
  const itemStyle = {
    textDecoration: item.packed ? "line-through" : "none",
    color: item.packed ? "gray" : "black",
  };

  return (
    <li style={itemStyle}>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => handleUpdateItem(item.id)}
      />
      {item.quantity} x {item.description} ({item.category})
      <button onClick={() => handleDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function PackingList({ items, handleDeleteItem, handleUpdateItem }) {
  const groupedItems = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="list">
      {Object.keys(groupedItems).map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {groupedItems[category].map((item) => (
              <Item
                key={item.id}
                item={item}
                handleDeleteItem={handleDeleteItem}
                handleUpdateItem={handleUpdateItem}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Stats({ items }) {
  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const badges = [];
  if (totalItems >= 5) badges.push("Starter Packer 🎒");
  if (percentage >= 50) badges.push("Efficient Packer 🧳");
  if (percentage === 100) badges.push("Master Packer 🏆");

  return (
    <footer className="stats">
      <em>
        {totalItems === 0
          ? "Your list is empty!"
          : percentage === 100
          ? "You got everything! 🎉"
          : `You have ${totalItems} items in the list, and you've already packed ${packedItems} (${percentage}%).`}
      </em>
      <div>
        {badges.length > 0 && <p>🎖️ Badges Earned: {badges.join(", ")}</p>}
      </div>
    </footer>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  function handleAddItems(item) {
    setItems((prevItems) => [...prevItems, item]);
  }

  function handleDeleteItem(id) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  function handleUpdateItem(id) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          margin: "10px auto",
          display: "block",
          width: "80%",
          padding: "10px",
          borderRadius: "10px",
        }}
      />
      <Form handleAddItems={handleAddItems} />
      <PackingList
        items={items.filter((item) =>
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        handleDeleteItem={handleDeleteItem}
        handleUpdateItem={handleUpdateItem}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;
