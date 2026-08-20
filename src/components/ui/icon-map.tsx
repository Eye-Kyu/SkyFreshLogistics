import {
  Clock,
  ClipboardCheck,
  Handshake,
  Leaf,
  MapPin,
  Package,
  Plane,
  Shield,
  Ship,
  Snowflake,
  Sprout,
} from "lucide-react";
import type { ServiceIconKey } from "@/data/services";
import type { CoreValueIconKey, ShippingModeIconKey } from "@/data/company";

export const serviceIconMap: Record<ServiceIconKey, typeof Package> = {
  package: Package,
  sprout: Sprout,
  "map-pin": MapPin,
  "clipboard-check": ClipboardCheck,
  snowflake: Snowflake,
  handshake: Handshake,
};

export const coreValueIconMap: Record<CoreValueIconKey, typeof Package> = {
  shield: Shield,
  clock: Clock,
  leaf: Leaf,
  handshake: Handshake,
};

export const shippingModeIconMap: Record<ShippingModeIconKey, typeof Package> = {
  plane: Plane,
  ship: Ship,
  package: Package,
};
