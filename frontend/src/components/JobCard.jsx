import { Link } from 'react-router-dom'

const typeColors = {
  'full-time': 'bg-green-100 text-green-700',
  'part-time': 'bg-yellow-100 text-yellow-700',
  'remote': 'bg-blue-100 text-blue-700',
  'contract': 'bg-purple-100 text-purple-700',
}

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
          <p className="text-indigo-600 text-sm font-medium">{job.company?.name}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${typeColors[job.type] || 'bg-gray-100 text-gray-600'}`}>
          {job.type}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
        <span>📍 {job.location}</span>
        {job.salary && <span>💰 {job.salary}</span>}
      </div>
      <p className="mt-3 text-gray-600 text-sm line-clamp-2">{job.description}</p>
      <div className="mt-4">
        <Link
          to={`/jobs/${job.id}`}
          className="inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          View & Apply
        </Link>
      </div>
    </div>
  )
}
