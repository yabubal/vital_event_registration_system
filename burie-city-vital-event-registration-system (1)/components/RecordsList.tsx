
import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Printer,
  ChevronDown,
  FileText
} from 'lucide-react';
import { VitalEventRecord, RegistrationStatus, UserRole, User, EventType } from '../types';
import { KEBELLES } from '../constants';
import { Language, useTranslation } from '../translations';
import CertificateView from './CertificateView';

interface RecordsListProps {
  records: VitalEventRecord[];
  user: User;
  lang: Language;
  onUpdate: (record: VitalEventRecord) => void;
}

const RecordsList: React.FC<RecordsListProps> = ({ records, user, lang, onUpdate }) => {
  const t = useTranslation(lang);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterKebele, setFilterKebele] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<VitalEventRecord | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  /* Client-side filtering replaced by Server-side search below */

  // NOTE: In a real "professional" app, we would debounce this search
  const [searchResults, setSearchResults] = useState<VitalEventRecord[]>(records);
  const [isSearching, setIsSearching] = useState(false);

  React.useEffect(() => {
    // If search term is empty, use the passed records (initial load)
    // Otherwise fetch from API
    const handler = setTimeout(async () => {
      if (!searchTerm) {
        setSearchResults(records);
        return;
      }

      setIsSearching(true);
      try {
        // In local dev, localhost URL might vary. Assuming API_BASE or relative.
        // We'll use absolute logic similar to App.tsx for now
        const res = await fetch(`http://localhost/burie-city-vital-event-registration-system%20(1)/api/records.php?search=${encodeURIComponent(searchTerm)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchTerm, records]);

  // Use searchResults for display, but still apply client-side type/kebele filters on top 
  // (Hybrid approach: Search query gets data, dropdowns filter that data locally)
  const displayedRecords = useMemo(() => {
    return searchResults.filter(r => {
      // Search is already done by server
      const matchesType = filterType === 'ALL' || r.type === filterType;
      const matchesKebele = filterKebele === 'ALL' || r.kebele === filterKebele;
      return matchesType && matchesKebele;
    });
  }, [searchResults, filterType, filterKebele]);

  const handleStatusUpdate = (record: VitalEventRecord, newStatus: RegistrationStatus) => {
    const updated = { ...record, status: newStatus };
    if (newStatus === RegistrationStatus.APPROVED && !record.certificateNumber) {
      updated.certificateNumber = `CERT-${Date.now().toString().slice(-8)}`;
    }
    onUpdate(updated);
    setSelectedRecord(updated);
  };

  if (showCertificate && selectedRecord) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setShowCertificate(false)}
          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium flex items-center gap-2"
        >
          <ChevronDown className="rotate-90" size={18} /> {lang === 'AM' ? 'ተመለስ' : 'Back to Records'}
        </button>
        <CertificateView record={selectedRecord} lang={lang} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={lang === 'AM' ? 'በመለያ ወይም በስም ይፈልጉ...' : "Search by ID or Name..."}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium">
            <option value="ALL">{lang === 'AM' ? 'ሁሉም ኩነቶች' : 'All Events'}</option>
            {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterKebele} onChange={(e) => setFilterKebele(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium">
            <option value="ALL">{lang === 'AM' ? 'ሁሉም ቀበሌዎች' : 'All Kebeles'}</option>
            {KEBELLES.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-4">
          {displayedRecords.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
              <FileText size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">{lang === 'AM' ? 'ምንም መዝገብ አልተገኘም።' : 'No records found.'}</p>
            </div>
          ) : (
            displayedRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={`bg-white p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedRecord?.id === record.id ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-slate-200'
                  }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl bg-blue-50 text-blue-600`}><FileText size={24} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">{record.id} <span className="text-[10px] uppercase px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">K-{record.kebele}</span></h4>
                    <p className="text-sm text-slate-500">{new Date(record.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <StatusBadge status={record.status} lang={lang} />
              </div>
            ))
          )}
        </div>

        <div className="xl:col-span-4 h-fit">
          {selectedRecord ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-6">
              <div className="flex justify-between items-start"><h3 className="text-lg font-black text-slate-800">{t('records')}</h3><button onClick={() => setSelectedRecord(null)} className="text-slate-400"><XCircle size={20} /></button></div>
              <div className="space-y-4">
                {Object.entries(selectedRecord.data).map(([key, value]: [string, any]) => (
                  <div key={key}><p className="text-[10px] text-slate-400 uppercase font-black">{key}</p><p className="text-sm font-medium text-slate-700">{value}</p></div>
                ))}
              </div>
              {(user.role === UserRole.ADMIN || user.role === UserRole.SUPERVISOR) && selectedRecord.status === RegistrationStatus.PENDING && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <button onClick={() => handleStatusUpdate(selectedRecord, RegistrationStatus.APPROVED)} className="bg-emerald-600 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2"><CheckCircle size={18} /> {lang === 'AM' ? 'አጽድቅ' : 'Approve'}</button>
                  <button onClick={() => handleStatusUpdate(selectedRecord, RegistrationStatus.REJECTED)} className="bg-rose-600 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2"><XCircle size={18} /> {lang === 'AM' ? 'ውድቅ አድርግ' : 'Reject'}</button>
                </div>
              )}
              {selectedRecord.status === RegistrationStatus.APPROVED && (
                <button onClick={() => setShowCertificate(true)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"><Printer size={18} /> {t('certificate')}</button>
              )}
            </div>
          ) : <div className="p-8 text-center text-slate-400 border border-dashed rounded-3xl">{lang === 'AM' ? 'መዝገብ ይምረጡ' : 'Select a record'}</div>}
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: RegistrationStatus; lang: Language }> = ({ status, lang }) => {
  const t = useTranslation(lang);
  const getLabel = (s: string) => {
    if (s === RegistrationStatus.PENDING) return t('pending');
    if (s === RegistrationStatus.APPROVED) return t('approved');
    if (s === RegistrationStatus.REJECTED) return t('rejected');
    return s;
  };
  const styles = {
    [RegistrationStatus.PENDING]: 'bg-amber-100 text-amber-700',
    [RegistrationStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-700',
    [RegistrationStatus.APPROVED]: 'bg-emerald-100 text-emerald-700',
    [RegistrationStatus.REJECTED]: 'bg-rose-100 text-rose-700',
  };
  return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${styles[status]}`}>{getLabel(status)}</span>;
};

export default RecordsList;
