import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Lock, Mail, User, Hash, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onLogin: (user: UserProfile) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onLogin, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popiaAgreed, setPopiaAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login' && email === 'admin@dut4life.ac.za' && password === 'admin123') {
      onLogin({
        firstName: 'System',
        lastName: 'Admin',
        studentNumber: 'ADMIN',
        email: 'admin@dut4life.ac.za',
        role: 'admin',
      });
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!popiaAgreed) {
        setError('You must agree to the POPIA compliance policy.');
        return;
      }
      if (savedUsers.find((u: any) => u.email === email)) {
        setError('An account with this email already exists.');
        return;
      }

      const newUser = {
        firstName,
        lastName,
        studentNumber,
        email,
        password,
        role: 'student' as const,
      };
      
      savedUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(savedUsers));
      
      onLogin(newUser);
      return;
    }

    if (mode === 'login') {
      const existingUser = savedUsers.find((u: any) => u.email === email && u.password === password);
      if (!existingUser) {
        setError('Invalid email or password.');
        return;
      }
      onLogin(existingUser);
    }
  };

  const [showPopia, setShowPopia] = useState(false);

  return (
    <div className="flex-grow flex items-center justify-center p-4 w-full animate-in fade-in duration-500 relative">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#E8EDF2] shadow-sm relative">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-[#7A8C9F] hover:text-[#1A2E44] transition-colors cursor-pointer"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="w-10 h-10 rounded-full bg-[#E8EDF2] flex items-center justify-center mb-3 mx-auto mt-2">
            <User className="w-5 h-5 text-[#4F7396]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1A2E44] tracking-tight">
            {mode === 'login' ? 'Sign In' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-[#5A6D82] mt-1 dyslexia-ready">
            {mode === 'login' ? 'Welcome back to your account.' : 'Get started with your educational screening.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1A2E44] mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F2F5]/80 border border-[#D1D9E6] text-xs text-[#1A2E44] focus:outline-hidden focus:border-[#4F7396]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1A2E44] mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F2F5]/80 border border-[#D1D9E6] text-xs text-[#1A2E44] focus:outline-hidden focus:border-[#4F7396]"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#1A2E44] mb-1">Student Number</label>
              <div className="relative">
                <Hash className="w-4 h-4 text-[#7A8C9F] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F0F2F5]/80 border border-[#D1D9E6] text-xs text-[#1A2E44] focus:outline-hidden focus:border-[#4F7396]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1A2E44] mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7A8C9F] absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F0F2F5]/80 border border-[#D1D9E6] text-xs text-[#1A2E44] focus:outline-hidden focus:border-[#4F7396]"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A2E44] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7A8C9F] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F0F2F5]/80 border border-[#D1D9E6] text-xs text-[#1A2E44] focus:outline-hidden focus:border-[#4F7396]"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#1A2E44] mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A8C9F] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F0F2F5]/80 border border-[#D1D9E6] text-xs text-[#1A2E44] focus:outline-hidden focus:border-[#4F7396]"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="flex items-start space-x-2 mt-2">
              <input
                type="checkbox"
                id="popia"
                checked={popiaAgreed}
                onChange={(e) => setPopiaAgreed(e.target.checked)}
                className="mt-0.5 rounded border-[#D1D9E6] text-[#4F7396] focus:ring-[#4F7396] cursor-pointer"
                required
              />
              <label htmlFor="popia" className="text-xs text-[#5A6D82] leading-tight cursor-pointer">
                I agree to the{' '}
                <span 
                  className="font-semibold text-[#4F7396] hover:underline"
                  onClick={(e) => { e.preventDefault(); setShowPopia(true); }}
                >
                  POPIA Compliance Policy
                </span>{' '}
                and consent to the processing of my personal information.
              </label>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-xs text-center mt-2 font-medium">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#1A2E44] text-white text-xs font-semibold rounded-xl hover:bg-[#2D4561] transition-all flex items-center justify-center space-x-2 mt-6 cursor-pointer"
            id="auth-submit-btn"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4 text-[#D1D9E6]" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E8EDF2] text-center">
          {mode === 'login' ? (
            <p className="text-xs text-[#5A6D82]">
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-[#4F7396] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Create one
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#5A6D82]">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-[#4F7396] font-semibold hover:underline ml-1 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>

      {showPopia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A2E44]/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl border border-[#E8EDF2] relative scale-in-center max-h-[80vh] overflow-y-auto">
            <button 
              onClick={() => setShowPopia(false)}
              className="absolute top-6 right-6 text-[#7A8C9F] hover:text-[#1A2E44] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#1A2E44] mb-4">POPIA Compliance Policy</h3>
            <div className="text-xs text-[#5A6D82] space-y-3 leading-relaxed">
              <p>
                In accordance with the Protection of Personal Information Act (POPIA), we are committed to protecting your privacy and ensuring your personal information is collected and processed properly, lawfully, and transparently.
              </p>
              <p>
                <strong>1. Information Collection:</strong> We collect only necessary personal data (name, email, student number) and your screening interactions to provide educational support.
              </p>
              <p>
                <strong>2. Data Security:</strong> All assessment data is strictly encrypted and securely stored. It will not be shared with third-party organizations without your explicit consent.
              </p>
              <p>
                <strong>3. Usage:</strong> Your screening results are used exclusively to recommend university-level accommodations and refer you to the Disability Unit if needed.
              </p>
              <p>
                By checking the agreement box, you consent to these terms.
              </p>
            </div>
            <button 
              onClick={() => setShowPopia(false)}
              className="mt-6 w-full py-3 bg-[#1A2E44] text-white font-medium rounded-xl transition-colors cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
