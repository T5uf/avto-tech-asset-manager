
import { Equipment, EquipmentCategory, EquipmentStatus } from "@/types";

export const mockEquipment: Equipment[] = [
  {
    id: "1",
    name: "Рабочая станция Dell OptiPlex 7090",
    inventoryNumber: "PC-2023-001",
    category: "computer",
    status: "active",
    purchaseDate: "2023-01-15",
    responsiblePerson: "Иванов И.И.",
    location: "Отдел разработки, каб. 201",
    description: "16GB RAM, 512GB SSD, Intel Core i7",
    imageUrl: "/placeholder.svg",
    history: [
      {
        id: "h1",
        date: "2023-01-16",
        action: "move",
        description: "Установка в Отдел разработки",
        performedBy: "Петров П.П."
      }
    ]
  },
  {
    id: "2",
    name: "Принтер HP LaserJet Pro M404dn",
    inventoryNumber: "PRN-2023-001",
    category: "printer",
    status: "active",
    purchaseDate: "2023-02-10",
    responsiblePerson: "Сидорова С.С.",
    location: "Бухгалтерия, каб. 105",
    imageUrl: "/placeholder.svg",
    history: []
  },
  {
    id: "3",
    name: "Коммутатор Cisco Catalyst 2960",
    inventoryNumber: "NET-2022-015",
    category: "network",
    status: "active",
    purchaseDate: "2022-11-20",
    responsiblePerson: "Петров П.П.",
    location: "Серверная, 1 этаж",
    description: "24 порта, управляемый",
    imageUrl: "/placeholder.svg",
    history: []
  },
  {
    id: "4",
    name: "Монитор Dell U2720Q",
    inventoryNumber: "MON-2023-008",
    category: "peripheral",
    status: "active",
    purchaseDate: "2023-03-05",
    responsiblePerson: "Иванов И.И.",
    location: "Отдел разработки, каб. 201",
    description: "27 дюймов, 4K",
    imageUrl: "/placeholder.svg",
    history: []
  },
  {
    id: "5",
    name: "Ноутбук Lenovo ThinkPad X1",
    inventoryNumber: "PC-2023-022",
    category: "computer",
    status: "repair",
    purchaseDate: "2023-01-30",
    responsiblePerson: "Смирнов С.С.",
    location: "Отдел маркетинга, каб. 310",
    description: "16GB RAM, 1TB SSD, Intel Core i7",
    imageUrl: "/placeholder.svg",
    history: [
      {
        id: "h2",
        date: "2023-05-12",
        action: "repair",
        description: "Отправлен в сервис (проблема с клавиатурой)",
        performedBy: "Петров П.П."
      }
    ]
  },
  {
    id: "6",
    name: "Планшет iPad Pro 11",
    inventoryNumber: "MOB-2023-003",
    category: "mobile",
    status: "active",
    purchaseDate: "2023-04-18",
    responsiblePerson: "Козлова К.К.",
    location: "Отдел дизайна, каб. 205",
    description: "256GB, Wi-Fi + Cellular",
    imageUrl: "/placeholder.svg",
    history: []
  },
  {
    id: "7",
    name: "Сетевой накопитель Synology DS220+",
    inventoryNumber: "STO-2022-005",
    category: "network",
    status: "active",
    purchaseDate: "2022-12-10",
    responsiblePerson: "Петров П.П.",
    location: "Серверная, 1 этаж",
    description: "2 диска по 4TB",
    imageUrl: "/placeholder.svg",
    history: []
  },
  {
    id: "8",
    name: "МФУ Canon imageRUNNER",
    inventoryNumber: "PRN-2022-012",
    category: "printer",
    status: "storage",
    purchaseDate: "2022-08-15",
    responsiblePerson: "Администратор",
    location: "Склад, комната 001",
    description: "Цветное МФУ A3",
    imageUrl: "/placeholder.svg",
    history: [
      {
        id: "h3",
        date: "2023-03-20",
        action: "status-change",
        description: "Перемещен на склад из-за реорганизации отдела",
        performedBy: "Сидорова С.С."
      }
    ]
  }
];

export const getStatusLabel = (status: EquipmentStatus): string => {
  const statusLabels: Record<EquipmentStatus, string> = {
    active: "В работе",
    repair: "На ремонте",
    storage: "На складе",
    "written-off": "Списано"
  };
  return statusLabels[status] || status;
};

export const getStatusColor = (status: EquipmentStatus): string => {
  const statusColors: Record<EquipmentStatus, string> = {
    active: "bg-green-100 text-green-800",
    repair: "bg-amber-100 text-amber-800",
    storage: "bg-blue-100 text-blue-800",
    "written-off": "bg-gray-100 text-gray-800"
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

export const getCategoryLabel = (category: EquipmentCategory): string => {
  const categoryLabels: Record<EquipmentCategory, string> = {
    computer: "Компьютеры",
    printer: "Принтеры",
    network: "Сетевое оборудование",
    peripheral: "Периферия",
    mobile: "Мобильные устройства",
    other: "Другое"
  };
  return categoryLabels[category] || category;
};

export const getCategoryIcon = (category: EquipmentCategory): string => {
  const categoryIcons: Record<EquipmentCategory, string> = {
    computer: "💻",
    printer: "🖨️",
    network: "🌐",
    peripheral: "🖥️",
    mobile: "📱",
    other: "📦"
  };
  return categoryIcons[category] || "📦";
};

export const getEquipmentById = (id: string): Equipment | undefined => {
  return mockEquipment.find(e => e.id === id);
};

export const getEquipmentByCategory = (category: EquipmentCategory): Equipment[] => {
  return mockEquipment.filter(e => e.category === category);
};

export const getEquipmentByStatus = (status: EquipmentStatus): Equipment[] => {
  return mockEquipment.filter(e => e.status === status);
};

export const getEquipmentCounts = () => {
  const counts = {
    total: mockEquipment.length,
    active: mockEquipment.filter(e => e.status === "active").length,
    repair: mockEquipment.filter(e => e.status === "repair").length,
    storage: mockEquipment.filter(e => e.status === "storage").length,
    writtenOff: mockEquipment.filter(e => e.status === "written-off").length
  };
  
  return counts;
};

export const getCategoryCounts = () => {
  const counts = {
    computer: mockEquipment.filter(e => e.category === "computer").length,
    printer: mockEquipment.filter(e => e.category === "printer").length,
    network: mockEquipment.filter(e => e.category === "network").length,
    peripheral: mockEquipment.filter(e => e.category === "peripheral").length,
    mobile: mockEquipment.filter(e => e.category === "mobile").length,
    other: mockEquipment.filter(e => e.category === "other").length
  };
  
  return counts;
};
