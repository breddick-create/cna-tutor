export function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="panel rounded-[1.5rem] p-5">
      <p className="text-muted text-sm font-medium">{title}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="text-muted mt-2 text-sm leading-6">{description}</p>
    </div>
  );
}

