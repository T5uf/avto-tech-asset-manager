
import { cn } from "@/lib/utils";
import { EquipmentStatus } from "@/types";
import { getStatusColor, getStatusLabel } from "@/utils/equipment";

interface StatusBadgeProps {
  status: EquipmentStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColor, className)}>
      {statusLabel}
    </span>
  );
};

export default StatusBadge;
