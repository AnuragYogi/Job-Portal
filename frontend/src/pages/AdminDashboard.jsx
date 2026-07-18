import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import DashboardCards from '../components/DashboardCards'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/users'),
      api.get('/admin/jobs'),
    ]).then(([statsRes, usersRes, jobsRes]) => {
      setStats(statsRes.data)
      setUsers(usersRes.data.data || usersRes.data)
      setJobs(jobsRes.data.data || jobsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return
    try {
      await api.delete(`/admin/jobs/${id}`)
      setJobs((prev) => prev.filter((j) => j.id !== id))
      toast.success('Job deleted')
    } catch {
      toast.error('Failed')
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  const cards = stats ? [
    { icon: '👥', label: 'Total Users', value: stats.total_users },
    { icon: '🏢', label: 'Companies', value: stats.total_companies },
    { icon: '💼', label: 'Total Jobs', value: stats.total_jobs },
    { icon: '📋', label: 'Applications', value: stats.total_applications },
  ] : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <DashboardCards cards={cards} />

      <div className="flex gap-2 mt-8 mb-6">
        {['overview', 'users', 'jobs'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${tab === t ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Recruiters</span><span className="font-medium">{stats?.total_recruiters}</span></div>
              <div className="flex justify-between"><span>Active Jobs</span><span className="font-medium">{stats?.active_jobs}</span></div>
              <div className="flex justify-between"><span>Total Applications</span><span className="font-medium">{stats?.total_applications}</span></div>
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'recruiter' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'jobs' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Company</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{j.title}</td>
                  <td className="px-4 py-3 text-gray-500">{j.company?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{j.location}</td>
                  <td className="px-4 py-3 text-gray-500">{j.type}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${j.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {j.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteJob(j.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
