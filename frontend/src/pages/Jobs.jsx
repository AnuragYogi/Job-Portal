import { useState, useEffect } from 'react'
import api from '../api/axios'
import JobCard from '../components/JobCard'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({ title: '', location: '', type: '' })
  const [searched, setSearched] = useState(false)

  // Strip empty params so Laravel's $request->filled() works correctly
  const cleanParams = (params) =>
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''))

  const fetchJobs = async (params = {}) => {
    setLoading(true)
    try {
      const clean = cleanParams(params)
      const hasSearch = clean.title || clean.location || clean.type
      const endpoint = hasSearch ? '/jobs/search' : '/jobs'
      const res = await api.get(endpoint, { params: clean })
      setJobs(res.data.data)
      setTotal(res.data.total)
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
      setJobs([])
      setTotal(0)
    }
    setLoading(false)
  }

  // Load all jobs on mount
  useEffect(() => { fetchJobs() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearched(true)
    fetchJobs(search)
  }

  const handleClear = () => {
    const reset = { title: '', location: '', type: '' }
    setSearch(reset)
    setSearched(false)
    fetchJobs({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
      <p className="text-gray-500 mb-6">
        {loading ? 'Loading...' : `${total} ${total === 1 ? 'job' : 'jobs'} found`}
      </p>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="Job title or keyword"
          value={search.title}
          onChange={(e) => setSearch({ ...search, title: e.target.value })}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          placeholder="Location"
          value={search.location}
          onChange={(e) => setSearch({ ...search, location: e.target.value })}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={search.type}
          onChange={(e) => setSearch({ ...search, type: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="remote">Remote</option>
          <option value="contract">Contract</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Search
        </button>
        {searched && (
          <button
            type="button"
            onClick={handleClear}
            className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Clear
          </button>
        )}
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {searched
            ? 'No jobs match your search. Try different keywords.'
            : 'No jobs available right now.'}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
