import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Find Your Dream Job <br />
          <span className="text-indigo-600">Today</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
          Connect with top companies. Browse thousands of jobs and apply with ease.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/jobs" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition text-sm">
            Browse Jobs
          </Link>
          {!user && (
            <Link to="/register" className="border border-indigo-200 text-indigo-700 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition text-sm">
              Get Started
            </Link>
          )}
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-700">10k+</div>
            <div className="text-sm text-gray-500 mt-1">Jobs Posted</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-700">5k+</div>
            <div className="text-sm text-gray-500 mt-1">Companies</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-700">50k+</div>
            <div className="text-sm text-gray-500 mt-1">Job Seekers</div>
          </div>
        </div>
      </div>
    </div>
  )
}
