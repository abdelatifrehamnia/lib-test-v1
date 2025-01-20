import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await window.electron.getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const newProduct = {
      designation: "New Product",
      brand_id: 1,
      model_id: 1,
      article_code: "NP-123",
    };

    await window.electron.addProduct(newProduct);
    const updatedProducts = await window.electron.getProducts();
    setProducts(updatedProducts);
  };

  return (
    <div>
      <h1>Products</h1>
      <button onClick={handleAddProduct}>Add Product</button>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.designation} - {product.article_code}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
