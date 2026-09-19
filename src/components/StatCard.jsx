import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ title, value, prefix, description, icon: Icon }) => {
  return (
    <Card className="border border-border shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-text-muted-2 uppercase tracking-wider">
          {title}
        </CardTitle>
        {Icon && (
          <div className="p-2 rounded-lg bg-accent">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-1">
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-base font-medium text-text-secondary">{prefix}</span>}
          <span className="text-2xl font-semibold tracking-tight text-foreground">{value}</span>
        </div>
        {description && (
          <p className="text-xs text-text-muted-2 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
