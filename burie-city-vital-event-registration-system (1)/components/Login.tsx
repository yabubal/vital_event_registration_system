
import React, { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowRight, Info } from 'lucide-react';
import { UserRole, User as UserType } from '../types';
import { Language, useTranslation } from '../translations';
import EthiopianFlag from './EthiopianFlag';

interface LoginProps {
  onLogin: (user: UserType) => void;
  lang: Language;
  setLang: (l: Language) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, lang, setLang }) => {
  const t = useTranslation(lang);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost/burie-city-vital-event-registration-system%20(1)/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please ensure the server is running.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <div className="hidden md:flex flex-1 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <EthiopianFlag className="w-12 h-8 rounded-md shadow-lg shadow-black/20" />
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-2xl font-black tracking-tight">{t('appName')}</h1>
            </div>
          </div>

          <div className="max-w-md space-y-6">
            <h2 className="text-5xl font-black leading-tight">{lang === 'AM' ? 'ዘመናዊ የወሳኝ ኩነቶች ምዝገባ ስርዓት' : 'Modern Vital Events Registration System'}</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Managing life's most important milestones with security, transparency, and legal compliance.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-4">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-1">
            <p className="text-blue-400 font-bold mb-1">8 Kebeles</p>
            <p className="text-xs text-slate-400">Integrated local jurisdiction management.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-1">
            <p className="text-emerald-400 font-bold mb-1">Multi-Lingual</p>
            <p className="text-xs text-slate-400">Amharic, Afaan Oromoo, and English.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white md:bg-transparent">
        {/* Mobile Logo Visibility */}
        <div className="md:hidden mb-8 flex items-center gap-3">
          <EthiopianFlag className="w-10 h-7 rounded-md" />
          <h1 className="text-xl font-black text-slate-900">{t('appName')}</h1>
        </div>

        <div className="mb-8 flex bg-slate-100 p-1 rounded-2xl shadow-inner no-print">
          <button onClick={() => setLang('AM')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${lang === 'AM' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>አማርኛ</button>
          <button onClick={() => setLang('OM')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${lang === 'OM' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Oromoo</button>
          <button onClick={() => setLang('EN')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${lang === 'EN' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>English</button>
        </div>

        <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100">
          <div className="text-center">
            <h3 className="text-3xl font-black text-slate-900 mb-2">{t('welcome')}</h3>
            <p className="text-slate-500 font-medium">{t('appSubName')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
                  placeholder="admin, clerk, or citizen"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                <Info size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
            >
              {t('login')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
