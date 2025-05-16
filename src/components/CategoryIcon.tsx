
import React from "react";
import { Computer, Printer, Network, Smartphone, Mouse, HelpCircle } from "lucide-react";
import { EquipmentCategory } from "@/types";

export const getCategoryIcon = (category: EquipmentCategory): JSX.Element => {
  switch (category) {
    case "computer":
      return <Computer className="h-4 w-4" />;
    case "printer":
      return <Printer className="h-4 w-4" />;
    case "network":
      return <Network className="h-4 w-4" />;
    case "mobile":
      return <Smartphone className="h-4 w-4" />;
    case "peripheral":
      return <Mouse className="h-4 w-4" />;
    case "other":
      return <HelpCircle className="h-4 w-4" />;
    default:
      return <HelpCircle className="h-4 w-4" />;
  }
};
