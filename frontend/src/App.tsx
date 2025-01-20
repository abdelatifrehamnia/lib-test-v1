import { ProductList } from "./components/ProductList";

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <ProductList />
    </div>
  );
}

export default App;
