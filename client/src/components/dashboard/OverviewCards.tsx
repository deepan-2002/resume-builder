interface OverviewCardsProps {
  stats: { label: string; value: string; delta?: string }[];
}

const OverviewCards = ({ stats }: OverviewCardsProps) => (
  <div className="grid gap-4 md:grid-cols-3">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <p className="text-sm text-slate-500">{stat.label}</p>
        <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
        {stat.delta && (
          <p className="text-xs text-emerald-600">+{stat.delta} vs last week</p>
        )}
      </div>
    ))}
  </div>
);

export default OverviewCards;

