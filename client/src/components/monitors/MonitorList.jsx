import MonitorCard from "./MonitorCard";

const MonitorList = ({ monitors, loading, error, onDelete }) => {
  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">Loading monitors...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }
  if (monitors.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
        <h3 className="text-lg font-semibold text-gray-800">No monitors yet</h3>

        <p className="mt-2 text-sm text-gray-500">
          Add your first website to start monitoring its uptime.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {monitors.map((monitor) => (
        <MonitorCard key={monitor._id} monitor={monitor} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default MonitorList;
