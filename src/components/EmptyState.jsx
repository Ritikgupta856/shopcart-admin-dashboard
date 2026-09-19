const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {Icon && (
        <div className="flex items-center justify-center size-12 rounded-full bg-secondary">
          <Icon className="size-5 text-text-muted-2" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-text-muted-2 max-w-sm">{description}</p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
