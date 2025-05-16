
import { Equipment, EquipmentCategory, EquipmentStatus } from "@/types";

// Mock database - in a real app this would be a backend API
export const equipmentData: Equipment[] = [
  {
    id: "1",
    name: "Lenovo ThinkPad X1",
    inventoryNumber: "PC-2023-001",
    category: "computer",
    status: "active",
    purchaseDate: "2023-01-15",
    responsiblePerson: "Иванов И.И.",
    location: "Офис #203",
    description: "16GB RAM, 512GB SSD",
    image: "/placeholder.svg",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=equipment%2FPC-2023-001"
  },
  {
    id: "2",
    name: "HP LaserJet Pro M404dn",
    inventoryNumber: "PR-2023-002",
    category: "printer",
    status: "repair",
    purchaseDate: "2023-02-20",
    responsiblePerson: "Петров А.С.",
    location: "Бухгалтерия",
    description: "Двусторонняя печать, Ethernet",
    image: "/placeholder.svg",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=equipment%2FPR-2023-002"
  },
  {
    id: "3",
    name: "Cisco Catalyst 2960",
    inventoryNumber: "NW-2023-003",
    category: "network",
    status: "active",
    purchaseDate: "2023-03-10",
    responsiblePerson: "Сидоров В.К.",
    location: "Серверная комната",
    description: "24 порта, PoE",
    image: "/placeholder.svg",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=equipment%2FNW-2023-003"
  },
  {
    id: "4",
    name: "Samsung Galaxy Tab S7",
    inventoryNumber: "MB-2023-004",
    category: "mobile",
    status: "storage",
    purchaseDate: "2023-04-01",
    responsiblePerson: "Кузнецова О.И.",
    location: "Склад",
    description: "128GB, Wi-Fi",
    image: "/placeholder.svg",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=equipment%2FMB-2023-004"
  },
  {
    id: "5",
    name: "Logitech MX Master 3",
    inventoryNumber: "PE-2023-005",
    category: "peripheral",
    status: "active",
    purchaseDate: "2023-05-05",
    responsiblePerson: "Морозов П.Л.",
    location: "Офис #205",
    description: "Беспроводная мышь",
    image: "/placeholder.svg",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=equipment%2FPE-2023-005"
  },
];

// Alias for backward compatibility
export const mockEquipment = equipmentData;

export const getEquipmentList = (): Equipment[] => {
  return equipmentData;
};

export const getEquipmentById = (id: string | undefined): Equipment | null => {
  if (!id) return null;
  return equipmentData.find(item => item.id === id) || null;
};

export const getFilteredEquipment = (
  searchTerm: string = "",
  category: EquipmentCategory | "all" = "all",
  status: EquipmentStatus | "all" = "all"
): Equipment[] => {
  return equipmentData.filter(item => {
    const matchesSearch = 
      !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.inventoryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = category === "all" || item.category === category;
    const matchesStatus = status === "all" || item.status === status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
};

export const saveEquipment = (equipment: Equipment): void => {
  const index = equipmentData.findIndex(item => item.id === equipment.id);
  
  if (index !== -1) {
    // Update existing equipment
    equipmentData[index] = {
      ...equipmentData[index],
      ...equipment,
      // Make sure image and qrCode are included
      image: equipment.image || equipmentData[index].image,
      qrCode: equipment.qrCode || equipmentData[index].qrCode
    };
  } else {
    // Add new equipment
    equipmentData.push({
      ...equipment,
      history: equipment.history || []
    });
  }
  
  // In a real app, this would be an API call
  console.log("Equipment saved:", equipment);
};

// Status utilities
export const getStatusColor = (status: EquipmentStatus): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "repair":
      return "bg-yellow-100 text-yellow-800";
    case "storage":
      return "bg-blue-100 text-blue-800";
    case "written-off":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusLabel = (status: EquipmentStatus): string => {
  switch (status) {
    case "active":
      return "В работе";
    case "repair":
      return "На ремонте";
    case "storage":
      return "На складе";
    case "written-off":
      return "Списано";
    default:
      return "Неизвестно";
  }
};

// Category utilities
export const getCategoryLabel = (category: EquipmentCategory): string => {
  switch (category) {
    case "computer":
      return "Компьютер";
    case "printer":
      return "Принтер";
    case "network":
      return "Сетевое оборудование";
    case "peripheral":
      return "Периферия";
    case "mobile":
      return "Мобильное устройство";
    case "other":
      return "Другое";
    default:
      return "Неизвестно";
  }
};

// Import necessary icons for the category icons function
import { Computer, Printer, Network, Smartphone, Mouse, HelpCircle } from "lucide-react";

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

// Statistics utilities
export const getEquipmentCounts = () => {
  const active = equipmentData.filter(item => item.status === "active").length;
  const repair = equipmentData.filter(item => item.status === "repair").length;
  const storage = equipmentData.filter(item => item.status === "storage").length;
  const writtenOff = equipmentData.filter(item => item.status === "written-off").length;
  const total = equipmentData.length;

  return {
    active,
    repair,
    storage,
    writtenOff,
    total
  };
};

export const getCategoryCounts = () => {
  const computer = equipmentData.filter(item => item.category === "computer").length;
  const printer = equipmentData.filter(item => item.category === "printer").length;
  const network = equipmentData.filter(item => item.category === "network").length;
  const peripheral = equipmentData.filter(item => item.category === "peripheral").length;
  const mobile = equipmentData.filter(item => item.category === "mobile").length;
  const other = equipmentData.filter(item => item.category === "other").length;

  return {
    computer,
    printer,
    network,
    peripheral,
    mobile,
    other
  };
};
