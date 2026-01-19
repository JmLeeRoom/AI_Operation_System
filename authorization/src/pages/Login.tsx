import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgba(0,212,170,0.1)] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgba(14,165,233,0.1)] rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[var(--accent-primary)] rounded-full opacity-30 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${12 + i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-card p-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4aa] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-[rgba(0,212,170,0.3)]">
              <Lock className="w-8 h-8 text-[var(--bg-primary)]" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-2">
            AuthZ Platform
          </h1>
          <p className="text-center text-[var(--text-muted)] mb-8">
            Enterprise Authorization Management System
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Username or Email"
                className="form-input pl-12"
                defaultValue="admin@company.com"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="form-input pl-12 pr-12"
                defaultValue="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--accent-primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)]">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-primary w-full py-3 text-base">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
            <span className="text-sm text-[var(--text-muted)]">or sign in with SSO</span>
            <div className="flex-1 h-px bg-[var(--border-primary)]"></div>
          </div>

          {/* SSO Buttons */}
          <div className="space-y-3">
            <button className="w-full py-2.5 px-4 rounded-lg border border-[rgba(0,136,206,0.3)] text-[var(--text-secondary)] hover:border-[#0088ce] hover:bg-[rgba(0,136,206,0.1)] transition-colors flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45v6.74L12 17.82l-6.9-3.45V7.63L12 4.18z"/>
              </svg>
              Continue with Keycloak SSO
            </button>
            <button className="w-full py-2.5 px-4 rounded-lg border border-[rgba(245,158,11,0.3)] text-[var(--text-secondary)] hover:border-[var(--accent-warning)] hover:bg-[rgba(245,158,11,0.1)] transition-colors flex items-center justify-center gap-3">
              <User className="w-5 h-5" />
              LDAP / Active Directory
            </button>
          </div>

          {/* Security Badge */}
          <div className="mt-6 p-3 rounded-lg bg-[rgba(0,212,170,0.05)] border border-[rgba(0,212,170,0.1)] flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
            <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>TLS 1.3 Encrypted · Zero Trust Security</span>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[var(--border-primary)] text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Need help? <a href="#" className="text-[var(--accent-primary)]">Contact IT Support</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
        .animate-float { animation: float 15s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
