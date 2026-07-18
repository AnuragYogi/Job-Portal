import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import ApplicationList from '../components/ApplicationList'

export default function Applicants() {
  const { id } = useParams()
  const [applications, setApplications] = useState([])
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get(`/job/${id}/applicants`),
      api.get(`/jobs/${id}`),
    ]).then(([appRes, jobRes]) => {
      setApplications(appRes.data)
      setJobTitle(jobRes.data.title)
    }).finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status })
      setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a))
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/recruiter" className="text-indigo-600 hover:underline text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Applicants for "{jobTitle}"</h1>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : (
        <ApplicationList
          applications={applications}
          showJob={false}
          showUser={true}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
