export default function Feature({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex animate-fade-up flex-col items-start gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-xl">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      </div>
    </div>
  );
}
