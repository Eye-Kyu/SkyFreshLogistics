"use client";

import { ReactNode, useState } from "react";
import { TabPills } from "./primitives";

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
      <TabPills items={tabs} active={active} onChange={setActive} />
      <div className="mt-8">{children(active)}</div>
    </div>
  );
}
