import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import DashboardCards from '../components/DashboardCards'

export default function RecruiterDashboard() {
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [companyForm, setCompanyForm] = useState({ name: '', description: '', location: '', website: '' })

  useEffect(() => {
    Promise.all([
      api.get('/my-company').catch(() => null),
      api.get('/my-jobs').catch(() => ({ data: [] })),
    ]).then(([compRes, jobsRes]) => {
      if (compRes?.data) setCompany(compRes.data)
      else setShowCompanyForm(true)
      setJobs(jobsRes.data || [])
      setLoading(false)
    })
  }, [])

  const handleCompanySubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/company', companyForm)
      setCompany(res.data.company)
      setShowCompanyForm(false)
      toast.success('Company profile saved')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    }
  }

  const stats = [
    { icon: '💼', label: 'Total Jobs', value: jobs.length },
    { icon: '✅', label: 'Active Jobs', value: jobs.filter((j) => j.is_active).length },
    { icon: '📩', label: 'Total Applications', value: jobs.reduce((sum, j) => sum + (j.applications_count || 0), 0) },
  ]

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your jobs and applicants</p>
      </div>

      {showCompanyForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Company Profile</h2>
          <form onSubmit={handleCompanySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={companyForm.description}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={companyForm.location}
                  onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
              Save Company
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{company?.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{company?.location}</p>
                {company?.description && <p className="text-sm text-gray-600 mt-2">{company.description}</p>}
              </div>
              <button
                onClick={() => setShowCompanyForm(true)}
                className="text-sm text-indigo-600 hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          <DashboardCards cards={stats} />

          <div className="mt-8 flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">My Jobs</h2>
            <Link to="/recruiter/post-job" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
              + Post Job
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No jobs posted yet.</div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {job.location} • {job.type} • {job.applications_count || 0} applicants
                    </p>
                  </div>
                  <Link
                    to={`/recruiter/job/${job.id}/applicants`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View Applicants →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
