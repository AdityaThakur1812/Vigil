const MonitorCard = ({ monitor, onDelete }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "up":
        return "bg-green-100 text-green-700";
      case "down":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {monitor.name}
          </h3>
          <p className="mt-1 truncate text-sm text-gray-500">{monitor.url}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
            monitor.currentStatus,
          )}`}
        >
          {monitor.currentStatus}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Check interval</p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            Every {monitor.intervalMinutes} minutes
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Monitor status</p>
          <p className="mt-1 text-sm font-medium capitalize text-gray-800">
            {monitor.status}
          </p>
        </div>
      </div>
      <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
        <button
          onClick={() => onDelete(monitor._id)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MonitorCard;