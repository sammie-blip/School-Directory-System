'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signUp, signIn, getCurrentUser } from '@/app/lib/auth'
import { User, Lock, Mail, UserCircle, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateSignup = () => {
    const nameRegex = /^[A-Za-z\s]+$/
    if (!nameRegex.test(firstName)) return 'First name must contain only letters'
    if (!nameRegex.test(lastName)) return 'Last name must contain only letters'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signupEmail)) return 'Enter a valid email address (e.g. user@gmail.com)'
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    if (!passwordRegex.test(signupPassword)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
    }
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({ username: loginUsername, password: loginPassword })
      await getCurrentUser()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const validationError = validateSignup()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      await signUp({
        email: signupEmail,
        password: signupPassword,
        firstName,
        lastName,
        username: signupUsername,
      })
      await getCurrentUser()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      <h1
        className={`text-5xl font-bold mb-0 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        School Directory System
      </h1>

      <div
        className={`transition-all duration-700 delay-300 w-full max-w-md ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="relative" style={{ minHeight: '620px' }}>
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
              isLogin ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
            }`}
          >
            <div className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white">
              <h2 className="text-3xl font-bold text-center mb-6">Welcome back</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/40 rounded-xl text-red-200 text-sm animate-fade-in">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 outline-none focus:border-white/60 transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 outline-none focus:border-white/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? 'Please wait...' : 'Log in'}
                </button>
              </form>
              <div className="mt-6 text-center text-white/80 text-sm">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false)
                    setError('')
                    setShowPassword(false)
                  }}
                  className="font-semibold text-white underline hover:opacity-80 transition-opacity"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
              !isLogin ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
            }`}
          >
            <div className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white">
              <h2 className="text-3xl font-bold text-center mb-6">Create account</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/40 rounded-xl text-red-200 text-sm animate-fade-in">
                  {error}
                </div>
              )}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 outline-none focus:border-white/60 transition-all"
                  />
                </div>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 outline-none focus:border-white/60 transition-all"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 outline-none focus:border-white/60 transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 outline-none focus:border-white/60 transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 outline-none focus:border-white/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? 'Please wait...' : 'Sign up'}
                </button>
              </form>
              <div className="mt-6 text-center text-white/80 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true)
                    setError('')
                    setShowPassword(false)
                  }}
                  className="font-semibold text-white underline hover:opacity-80 transition-opacity"
                >
                  Log in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}