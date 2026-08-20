"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { TabPills } from "@/components/ui/primitives";

type Category = { id: string; label: string };
type Product = { name: string; category: string; description: string };

export function FilterableProductGrid({
  categories,
  products,
  tone = "green",
}: {
  categories: Category[];
  products: Product[];
  tone?: "green" | "blue";
}) {
  const [active, setActive] = useState(categories[0].id);
  const filtered =
    active === "all" ? products : products.filter((p) => p.category === active);
  const labelFor = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  return (
    <div>
      <TabPills items={categories} active={active} onChange={setActive} />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard
            key={product.name}
            name={product.name}
            category={labelFor(product.category)}
            description={product.description}
            tone={tone}
          />
        ))}
      </div>
    </div>
  );
}
