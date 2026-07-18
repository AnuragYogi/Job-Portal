import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import ApplicationList from '../components/ApplicationList'
import DashboardCards from '../components/DashboardCards'

export default function UserDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/my-applications')
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { icon: '📋', label: 'Total Applied', value: applications.length },
    { icon: '⏳', label: 'Pending', value: applications.filter((a) => a.status === 'pending').length },
    { icon: '✅', label: 'Accepted', value: applications.filter((a) => a.status === 'accepted').length },
    { icon: '❌', label: 'Rejected', value: applications.filter((a) => a.status === 'rejected').length },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Track your job applications</p>
      </div>

      <DashboardCards cards={stats} />

      <div className="mt-8 flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">My Applications</h2>
        <Link to="/jobs" className="text-sm text-indigo-600 hover:underline">Browse Jobs →</Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : (
        <ApplicationList applications={applications} showJob={true} />
      )}
    </div>
  )
}
