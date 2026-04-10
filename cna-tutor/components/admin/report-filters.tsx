export function ReportFilters({
  cohorts,
  current,
}: {
  cohorts: string[];
  current: {
    from: string;
    to: string;
    cohort: string;
    activity: "all" | "active" | "inactive" | "low_hours" | "low_scores";
  };
}) {
  return (
    <form className="panel rounded-[1.75rem] p-6" method="get">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-40 flex-1">
          <label className="mb-2 block text-sm font-medium" htmlFor="from">
            From
          </label>
          <input className="input-base" defaultValue={current.from} id="from" name="from" type="date" />
        </div>
        <div className="min-w-40 flex-1">
          <label className="mb-2 block text-sm font-medium" htmlFor="to">
            To
          </label>
          <input className="input-base" defaultValue={current.to} id="to" name="to" type="date" />
        </div>
        <div className="min-w-40 flex-1">
          <label className="mb-2 block text-sm font-medium" htmlFor="cohort">
            Cohort
          </label>
          <select className="input-base" defaultValue={current.cohort} id="cohort" name="cohort">
            <option value="">All cohorts</option>
            {cohorts.map((cohort) => (
              <option key={cohort} value={cohort}>
                {cohort}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-40 flex-1">
          <label className="mb-2 block text-sm font-medium" htmlFor="activity">
            Activity
          </label>
          <select className="input-base" defaultValue={current.activity} id="activity" name="activity">
            <option value="all">All learners</option>
            <option value="active">Active this week</option>
            <option value="inactive">Inactive</option>
            <option value="low_hours">Low study hours</option>
            <option value="low_scores">Low scores</option>
          </select>
        </div>
        <button className="button-primary" type="submit">
          Apply filters
        </button>
      </div>
    </form>
  );
}
