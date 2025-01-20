import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const ProductList = () => {
  const { products, loading, error, addProduct } = useProducts();
  const [designation, setDesignation] = useState("");
  const [articleCode, setArticleCode] = useState("");

  const handleAddProduct = async () => {
    if (!designation || !articleCode) return;
    await addProduct({ designation, articleCode });
    setDesignation("");
    setArticleCode("");
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            List of all products in the inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
              <Input
                placeholder="Article Code"
                value={articleCode}
                onChange={(e) => setArticleCode(e.target.value)}
              />
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>

            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))
              : products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{product.designation}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.articleCode}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
