'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../lib/auth';
import { ROLE_THEMES } from '../../lib/theme';
import { authService } from '../../services/api';
import { User, Lock, Mail, AlertCircle, CheckCircle2, Loader2, Sparkles, GraduationCap, Shield } from 'lucide-react';

const DEMO_ACCOUNTS: { role: UserRole; email: string; title: string; colorDot: string }[] = [
  { role: 'STUDENT', email: 'student@school.edu', title: 'Student', colorDot: 'bg-emerald-500' },
  { role: 'REGISTRAR', email: 'registrar@school.edu', title: 'Registrar', colorDot: 'bg-blue-500' },
  { role: 'SAO', email: 'sao@school.edu', title: 'Student Affairs', colorDot: 'bg-amber-500' },
  { role: 'LIBRARIAN', email: 'librarian@school.edu', title: 'Librarian', colorDot: 'bg-purple-500' },
  { role: 'ADMIN', email: 'admin@school.edu', title: 'Administrator', colorDot: 'bg-rose-600' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const searchParams = useSearchParams();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('student@school.edu');
  const [password, setPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('STUDENT');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized_role') {
      setErrorMsg('Access Denied: Your account role does not have permission to access that route.');
    } else if (errorParam === 'session_expired') {
      setErrorMsg('Your session has expired. Please sign in again.');
    }
  }, [searchParams]);

  const activeTheme = ROLE_THEMES[mode === 'login' ? selectedRole : regRole];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      await authService.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });

      setSuccessMsg('Account registered successfully! Signing you in...');

      // Automatically sign in the newly registered user
      await login(regEmail, regPassword);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration failed. Please check your details.');
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword('password123');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 transition-colors duration-700 bg-gradient-to-br ${activeTheme.loginGradient} overflow-hidden`}
    >
      {/* Background Architectural Light & Shape Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl transition-all duration-700 ${activeTheme.ambientGlow}`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[30rem] h-[30rem] rounded-full blur-3xl transition-all duration-700 ${activeTheme.ambientGlow}`}
        />
        <div className="hidden lg:block absolute left-1/3 top-0 bottom-0 w-8 bg-white/[0.02] border-r border-white/[0.04]" />
        <div className="hidden lg:block absolute left-2/3 top-0 bottom-0 w-8 bg-white/[0.02] border-r border-white/[0.04]" />
      </div>

      {/* Top Brand Logo - Styled directly from reference image "MYCAMPUSDAYS" */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-white text-sm font-serif tracking-[0.22em] uppercase font-semibold drop-shadow-sm">
            MYCAMPUSDAYS
          </span>
        </div>

        {/* Role Palette Status */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90">
          <span className={`w-2 h-2 rounded-full ${activeTheme.primary}`} />
          <span className="font-medium tracking-wide">
            Connected Palette: <span className="font-bold text-white">{activeTheme.name}</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto my-auto py-8 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12">
        {/* Left Side: Frosted Glass Box */}
        <div className="w-full max-w-md bg-white/[0.12] backdrop-blur-xl border border-white/20 rounded-2xl p-8 sm:p-10 shadow-2xl text-white">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center space-x-2 p-1 bg-white/10 rounded-xl mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Headers */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
              {mode === 'login' ? 'Welcome' : 'Create Account'}
            </h1>
            <p className="text-sm font-light text-white/80 mt-1">
              {mode === 'login' ? 'Today will be great' : 'Register your institutional identity'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-6 p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-start space-x-3 text-rose-100 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-300 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-start space-x-3 text-emerald-100 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-300 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <div className="relative flex items-center border-b border-white/40 focus-within:border-white transition-colors pb-2">
                  <User className="w-4 h-4 text-white/80 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Username / Email"
                    className="w-full bg-transparent text-white placeholder-white/70 text-sm font-light focus:outline-none tracking-wide"
                  />
                </div>
              </div>

              <div>
                <div className="relative flex items-center border-b border-white/40 focus-within:border-white transition-colors pb-2">
                  <Lock className="w-4 h-4 text-white/80 mr-3 flex-shrink-0" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent text-white placeholder-white/70 text-sm font-light focus:outline-none tracking-wide"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-md font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <span>LOGIN</span>
                )}
              </button>

              <div className="pt-2 flex items-center justify-between text-xs font-light">
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Default password for seeded accounts: password123');
                  }}
                  className="text-white/75 hover:text-white transition-colors"
                >
                  Forgot Password ?
                </a>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-white font-medium hover:underline"
                >
                  Create account
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <div className="relative flex items-center border-b border-white/40 focus-within:border-white transition-colors pb-2">
                  <User className="w-4 h-4 text-white/80 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="w-full bg-transparent text-white placeholder-white/70 text-sm font-light focus:outline-none tracking-wide"
                  />
                </div>
              </div>

              <div>
                <div className="relative flex items-center border-b border-white/40 focus-within:border-white transition-colors pb-2">
                  <Mail className="w-4 h-4 text-white/80 mr-3 flex-shrink-0" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Institutional Email"
                    className="w-full bg-transparent text-white placeholder-white/70 text-sm font-light focus:outline-none tracking-wide"
                  />
                </div>
              </div>

              <div>
                <div className="relative flex items-center border-b border-white/40 focus-within:border-white transition-colors pb-2">
                  <Lock className="w-4 h-4 text-white/80 mr-3 flex-shrink-0" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Password (minimum 6 chars)"
                    className="w-full bg-transparent text-white placeholder-white/70 text-sm font-light focus:outline-none tracking-wide"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/75 uppercase tracking-wider mb-2">
                  Assigned RBAC Role Domain
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['STUDENT', 'REGISTRAR', 'SAO', 'LIBRARIAN', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegRole(r)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition border text-left flex items-center space-x-1.5 ${
                        regRole === r
                          ? 'bg-white text-slate-900 border-white shadow-sm'
                          : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/20'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${ROLE_THEMES[r].primary}`} />
                      <span>{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-md font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    <span>CREATING ACCOUNT...</span>
                  </>
                ) : (
                  <span>REGISTER ACCOUNT</span>
                )}
              </button>

              <div className="pt-2 text-center text-xs font-light">
                <span className="text-white/70">Already have an identity? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-white font-medium hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Role Color Theme Selector */}
        <div className="w-full max-w-lg lg:pl-8 text-white space-y-5">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Role Color Connection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white leading-tight">
              Select a domain to connect its design color to the dashboard
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-2 font-light leading-relaxed">
              Each institutional role features an assigned color palette. When you sign in or
              register, the entire dashboard navigation, telemetry, and accents will transition
              into that role's color theme.
            </p>
          </div>

          {/* Quick Role Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = (mode === 'login' ? selectedRole : regRole) === acc.role;

              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => {
                    if (mode === 'login') {
                      handleRoleSelect(acc);
                    } else {
                      setRegRole(acc.role);
                    }
                  }}
                  className={`flex items-center space-x-3 p-3.5 rounded-xl border text-left transition-all backdrop-blur-md ${
                    isSelected
                      ? 'bg-white/25 border-white text-white shadow-xl scale-[1.02]'
                      : 'bg-white/10 border-white/10 text-white/80 hover:bg-white/15 hover:border-white/20'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${acc.colorDot} ring-2 ring-white/40`} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold tracking-wider uppercase text-white truncate">
                      {acc.title}
                    </div>
                    <div className="text-[11px] text-white/60 truncate">{acc.email}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto text-center sm:text-left text-xs text-white/50 font-light">
        <span>Unified School Lifecycle Management System • Strict RBAC Architecture</span>
      </footer>
    </div>
  );
}
