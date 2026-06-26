"use client";

import dynamic from "next/dynamic";

const LocationCard = dynamic(() => import("./LocationCard"), { ssr: false });

export default function DynamicLocationCard() {
  return <LocationCard />;
}
