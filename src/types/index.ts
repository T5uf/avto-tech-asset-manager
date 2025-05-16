
export type EquipmentStatus =
  | "active"
  | "repair"
  | "storage"
  | "written-off";

export type EquipmentCategory =
  | "computer"
  | "printer"
  | "network"
  | "peripheral"
  | "mobile"
  | "other";

export interface Equipment {
  id: string;
  name: string;
  inventoryNumber: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  purchaseDate: string;
  responsiblePerson: string;
  location: string;
  description?: string;
  imageUrl?: string;
  history?: HistoryEntry[];
  image?: string; // Added missing property
  qrCode?: string; // Added missing property
}

export interface HistoryEntry {
  id: string;
  date: string;
  action: "move" | "repair" | "upgrade" | "status-change";
  description: string;
  performedBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "engineer" | "employee";
}

export interface Department {
  id: string;
  name: string;
  responsible: string;
}
