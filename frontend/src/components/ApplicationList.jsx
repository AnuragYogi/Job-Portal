const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function ApplicationList({ applications, showJob = true, showUser = false, onStatusChange }) {
  if (!applications?.length) {
    return <p className="text-gray-500 text-center py-8">No applications found.</p>
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div key={app.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {showJob && (
              <p className="font-semibold text-gray-800">{app.job?.title || app.job_listing?.title}</p>
            )}
            {showJob && (
              <p className="text-sm text-indigo-600">{app.job?.company?.name || app.job_listing?.company?.name}</p>
            )}
            {showUser && (
              <p className="font-semibold text-gray-800">{app.user?.name}</p>
            )}
            {showUser && (
              <p className="text-sm text-gray-500">{app.user?.email}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{new Date(app.created_at).toLocaleDateString()}</p>
            {app.cover_letter && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">"{app.cover_letter}"</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[app.status]}`}>
              {app.status}
            </span>
            {onStatusChange && (
              <select
                value={app.status}
                onChange={(e) => onStatusChange(app.id, e.target.value)}
                className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
