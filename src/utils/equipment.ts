import { Equipment, EquipmentCategory, EquipmentStatus } from "@/types";

// Mock database - in a real app this would be a backend API
let equipmentData: Equipment[] = [
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
