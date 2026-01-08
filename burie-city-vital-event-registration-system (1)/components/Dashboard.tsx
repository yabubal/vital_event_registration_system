
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  TrendingUp,
  Users,
  FileCheck,
  XCircle,
  Download,
  Database,
  ShieldCheck
} from 'lucide-react';
import { VitalEventRecord, EventType, RegistrationStatus, User } from '../types';
import { KEBELLES } from '../constants';
import { Language, useTranslation } from '../translations';

interface DashboardProps {
  records: VitalEventRecord[];
  user: User;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ records, user, lang }) => {
  const t = useTranslation(lang);
  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter(r => r.status === RegistrationStatus.PENDING).length;
    const approved = records.filter(r => r.status === RegistrationStatus.APPROVED).length;
    const rejected = records.filter(r => r.status === RegistrationStatus.REJECTED).length;

    const byType = {
      [EventType.BIRTH]: records.filter(r => r.type === EventType.BIRTH).length,
      [EventType.DEATH]: records.filter(r => r.type === EventType.DEATH).length,
      [EventType.MARRIAGE]: records.filter(r => r.type === EventType.MARRIAGE).length,
      [EventType.DIVORCE]: records.filter(r => r.type === EventType.DIVORCE).length,
    };

    const byKebele = KEBELLES.map(k => ({
      name: k.name,
      count: records.filter(r => r.kebele === k.id).length,
      births: records.filter(r => r.kebele === k.id && r.type === EventType.BIRTH).length,
    }));

    return { total, pending, approved, rejected, byType, byKebele };
  }, [records]);

  const eventTypeData = [
    { name: t('birth'), value: stats.byType[EventType.BIRTH], color: '#3b82f6' },
    { name: t('death'), value: stats.byType[EventType.DEATH], color: '#ef4444' },
    { name: t('marriage'), value: stats.byType[EventType.MARRIAGE], color: '#ec4899' },
    { name: t('divorce'), value: stats.byType[EventType.DIVORCE], color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Database size={300} />
        </div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <ShieldCheck size={12} /> Official System
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {t('welcome')}, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-emerald-200">
                  {user.fullName}
                </span>
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl">
                {lang === 'AM' ? 'እንኳን ወደ ቡሬ ከተማ አስተዳደር ወሳኝ ኩነቶች ምዝገባ ስርዓት በደህና መጡ።' : 'Welcome to the Burie City Administration Vital Events Registration System.'}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-5 py-3 bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/20 transition-colors">
                <Database size={20} className="text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">System Status</span>
                  <span className="text-sm font-bold text-white">Online & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard delay={100} title={lang === 'AM' ? 'ጠቅላላ ምዝገባዎች' : "Total Registrations"} value={stats.total} icon={<Users className="text-blue-600" />} color="blue" />
        <StatCard delay={200} title={t('pending')} value={stats.pending} icon={<TrendingUp className="text-amber-600" />} color="amber" />
        <StatCard delay={300} title={t('approved')} value={stats.approved} icon={<FileCheck className="text-emerald-600" />} color="emerald" />
        <StatCard delay={400} title={t('rejected')} value={stats.rejected} icon={<XCircle className="text-rose-600" />} color="rose" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><TrendingUp size={20} /></div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{lang === 'AM' ? 'የቀበሌዎች ምዝገባ' : 'Registration by Kebele'}</h3>
                <p className="text-xs text-slate-400 font-medium">Real-time data visualization</p>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byKebele} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-bold text-slate-800 mb-2">{lang === 'AM' ? 'የኩነቶች ስርጭት' : 'Event Distribution'}</h3>
          <p className="text-xs text-slate-400 font-medium mb-8">Breakdown by event type</p>
          <div className="flex-1 w-full h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={8}
                  stroke="none"
                >
                  {eventTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{stats.total}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-3 mt-6">
            {eventTypeData.map(e => (
              <div key={e.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }}></div>
                {e.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string; delay: number }> = ({ title, value, icon, color, delay }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'
  };

  return (
    <div
      className="group bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-40 animate-in slide-in-from-bottom-4 fade-in fill-mode-forwards"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start">
        <div className={`p-3.5 rounded-2xl transition-colors duration-300 ${colorMap[color]}`}>{icon}</div>
        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 group-hover:bg-slate-100 transition-colors`}>
          Last 30 Days
        </div>
      </div>
      <div>
        <span className="text-4xl font-black text-slate-800 tracking-tight">{value}</span>
        <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
      </div>
    </div>
  );
};

export default Dashboard;
