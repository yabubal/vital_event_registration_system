
import React from 'react';
import { Search, ChevronRight, MapPin, Clock } from 'lucide-react';
import { VitalEventRecord, RegistrationStatus, User } from '../types';
import { Language, useTranslation } from '../translations';

interface StatusTrackerProps {
  records: VitalEventRecord[];
  user: User;
  lang: Language;
}

const StatusTracker: React.FC<StatusTrackerProps> = ({ records, user, lang }) => {
  const t = useTranslation(lang);
  const myRecords = records.filter(r => r.applicantId === user.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t('status')}</h2>
        <p className="text-slate-500 text-lg max-w-lg mx-auto">{lang === 'AM' ? 'የማመልከቻዎችዎ ሂደት ደረጃ እዚህ ይከታተሉ።' : 'View the real-time processing status of your registrations.'}</p>
      </div>

      <div className="space-y-4">
        {myRecords.length === 0 ? (
          <div className="bg-white p-16 rounded-[40px] shadow-xl border border-slate-100 text-center">
            <Search className="text-slate-200 mx-auto mb-4" size={40} />
            <p className="text-slate-500 font-medium">{lang === 'AM' ? 'ምንም ማመልከቻ አልተገኘም።' : 'No applications found.'}</p>
          </div>
        ) : (
          myRecords.map((record) => (
            <div key={record.id} className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between group">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0"><Clock size={32} /></div>
                <div>
                  <h4 className="text-xl font-black text-slate-800">{record.type}</h4>
                  <div className="flex gap-4 text-slate-500 text-sm"><span className="flex items-center gap-1"><MapPin size={14}/> {t('kebele')} {record.kebele}</span></div>
                </div>
              </div>
              <div className="text-right">
                <StatusDisplay status={record.status} lang={lang} />
                <p className="text-[10px] text-slate-400 mt-2">{record.id}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatusDisplay: React.FC<{ status: RegistrationStatus; lang: Language }> = ({ status, lang }) => {
  const t = useTranslation(lang);
  const themes = {
    [RegistrationStatus.PENDING]: 'bg-amber-100 text-amber-800 border-amber-200',
    [RegistrationStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-800 border-blue-200',
    [RegistrationStatus.APPROVED]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [RegistrationStatus.REJECTED]: 'bg-rose-100 text-rose-800 border-rose-200',
  };
  const getLabel = (s: string) => {
    if (s === RegistrationStatus.PENDING) return t('pending');
    if (s === RegistrationStatus.APPROVED) return t('approved');
    if (s === RegistrationStatus.REJECTED) return t('rejected');
    return s;
  };

  return <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${themes[status]}`}>{getLabel(status)}</div>;
};

export default StatusTracker;
