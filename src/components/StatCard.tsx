
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  description,
  trend, 
  className 
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${
            trend.isPositive ? "text-green-600" : "text-red-600"
          }`}>
            <span>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </span>
            <span className="ml-1 text-muted-foreground">с прошлого месяца</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
