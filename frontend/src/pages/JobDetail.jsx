import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [resume, setResume] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!resume) { toast.error('Please select a PDF resume'); return }

    const formData = new FormData()
    formData.append('resume', resume)
    if (coverLetter) formData.append('cover_letter', coverLetter)

    setApplying(true)
    try {
      await api.post(`/apply/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Application submitted!')
      setShowForm(false)
    } catch (err) {
      const msg = err.response?.data?.message
      const errors = err.response?.data?.errors
      if (errors) Object.values(errors).flat().forEach((m) => toast.error(m))
      else toast.error(msg || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!job) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-indigo-600 font-medium mt-1">{job.company?.name}</p>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">{job.type}</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <span>📍 {job.location}</span>
          {job.salary && <span>💰 {job.salary}</span>}
          {job.company?.website && (
            <a href={job.company.website} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">
              🌐 Company Website
            </a>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 mb-8 whitespace-pre-line">
          {job.description}
        </div>

        {user?.role === 'user' && (
          <>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Apply Now
              </button>
            ) : (
              <form onSubmit={handleApply} className="border-t border-gray-100 pt-6 space-y-4">
                <h3 className="font-semibold text-gray-800">Submit Application</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF only)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setResume(e.target.files[0])}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-sm file:font-medium hover:file:bg-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (optional)</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Tell us why you're a great fit..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={applying}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {!user && (
          <p className="text-sm text-gray-500">
            <button onClick={() => navigate('/login')} className="text-indigo-600 font-medium hover:underline">Sign in</button> to apply for this job.
          </p>
        )}
      </div>
    </div>
  )
}
