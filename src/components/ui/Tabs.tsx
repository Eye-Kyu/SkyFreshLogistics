"use client";

import { ReactNode, useState } from "react";
import { Segmented } from "./primitives";

// No page uses this since the redesign; kept pending the owner's OK to delete.
export function Tabs<T extends string>({
  tabs,
  defaultTab,
  children,
}: {
  tabs: { id: T; label: string }[];
  defaultTab: T;
  children: (activeTab: T) => ReactNode;
}) {
  const [active, setActive] = useState<T>(defaultTab);

  return (
    <div>
      <Segmented items={tabs} active={active} onChange={setActive} label="Choose a view" />
      <div>{children(active)}</div>
    </div>
  );
}
