"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/primitives";

type Category = { id: string; label: string };
type Product = { name: string; category: string; description: string };

// The range as a filterable index: name, family and one line each.
export function FilterableProductGrid({
  categories,
  products,
  label,
}: {
  categories: Category[];
  products: Product[];
  label: string;
}) {
  const [active, setActive] = useState(categories[0].id);
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);
  const labelFor = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  return (
    <div>
      <Segmented items={categories} active={active} onChange={setActive} label={`Filter ${label}`} />
      <ul className="catalog" aria-label={label} aria-live="polite">
        {filtered.map((product) => (
          <li key={product.name}>
            <span>{labelFor(product.category)}</span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
