
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FilePlus,
  Users,
  ShieldCheck,
  LogOut,
  Menu,
  FileText,
  History,
  TrendingUp,
  MapPin,
  Bell,
  Languages,
  Database
} from 'lucide-react';
import { User, UserRole, RegistrationStatus, VitalEventRecord, AuditLog } from './types';
import { Language, useTranslation } from './translations';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import RecordsList from './components/RecordsList';
import UserManagement from './components/UserManagement';
import AuditLogs from './components/AuditLogs';
import StatusTracker from './components/StatusTracker';
import EthiopianFlag from './components/EthiopianFlag';
import DataManagement from './components/DataManagement';

// Ensure this matches the actual URL where XAMPP serves the project
const API_BASE = 'http://localhost/burie-city-vital-event-registration-system%20(1)/api/records.php';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('AM');
  const t = useTranslation(lang);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState<VitalEventRecord[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    // Load persisted state (keeping user in local storage for session)
    const savedUser = localStorage.getItem('burie_user');
    const savedLang = localStorage.getItem('burie_lang') as Language;

    if (savedUser) setUser(JSON.parse(savedUser));

    fetchRecords(); // Fetch from API
    fetchLogs();    // Fetch logs from API

    if (savedLang) setLang(savedLang);
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch(API_BASE);
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        console.error("Failed to fetch records");
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost/burie-city-vital-event-registration-system%20(1)/api/logs.php');
      if (response.ok) {
        setLogs(await response.json());
      }
    } catch (e) { console.error("Failed to fetch logs", e); }
  };

  const changeLanguage = (l: Language) => {
    setLang(l);
    localStorage.setItem('burie_lang', l);
  };

  const addLog = async (action: string, details: string) => {
    // Optimistic UI update
    const newLog: AuditLog = {
      id: Date.now().toString(), // Temp ID
      timestamp: new Date().toISOString(),
      userId: user?.id || 'SYSTEM',
      userName: user?.fullName || 'System',
      action,
      details
    };
    setLogs(prev => [newLog, ...prev]);

    // Send to API
    try {
      await fetch('http://localhost/burie-city-vital-event-registration-system%20(1)/api/logs.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
      fetchLogs(); // Refresh to get real ID
    } catch (e) {
      console.error("Failed to save log", e);
    }
  };

  // Replaced by specific API calls
  // const saveRecords = (updatedRecords: VitalEventRecord[]) => {
  //   setRecords(updatedRecords);
  //   localStorage.setItem('burie_records', JSON.stringify(updatedRecords));
  // };

  const createRecord = async (record: VitalEventRecord) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (response.ok) {
        fetchRecords(); // Refresh list
      } else {
        alert("Failed to save record to database.");
      }
    } catch (error) {
      console.error("Error creating record:", error);
      alert("Error connecting to server.");
    }
  };

  const updateRecordStatus = async (record: VitalEventRecord) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, status: record.status })
      });
      if (response.ok) {
        fetchRecords(); // Refresh list
      } else {
        alert("Failed to update record status.");
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleRestore = (data: { records: VitalEventRecord[], logs: AuditLog[] }) => {
    setRecords(data.records);
    setLogs(data.logs);
    // Restoration logic might need API support later
    localStorage.setItem('burie_records', JSON.stringify(data.records));
    localStorage.setItem('burie_logs', JSON.stringify(data.logs));
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('burie_user', JSON.stringify(newUser));
    addLog('LOGIN', `User ${newUser.username} logged in.`);
  };

  const handleLogout = () => {
    addLog('LOGOUT', `User ${user?.username} logged out.`);
    setUser(null);
    localStorage.removeItem('burie_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} lang={lang} setLang={changeLanguage} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard records={records} user={user} lang={lang} />;
      case 'register':
        return (
          <RegistrationForm
            user={user}
            lang={lang}
            onSubmit={(record) => {
              createRecord(record);
              addLog('CREATE_RECORD', `Created ${record.type} registration.`);
              setActiveTab('records');
            }}
          />
        );
      case 'records':
        return (
          <RecordsList
            records={records}
            user={user}
            lang={lang}
            onUpdate={(updatedRecord) => {
              updateRecordStatus(updatedRecord);
              addLog('UPDATE_RECORD', `Updated status of record ${updatedRecord.id} to ${updatedRecord.status}`);
            }}
          />
        );
      case 'status':
        return <StatusTracker records={records} user={user} lang={lang} />;
      case 'users':
        return <UserManagement user={user} lang={lang} onLog={addLog} />;
      case 'audit':
        return <AuditLogs logs={logs} lang={lang} />;
      case 'data':
        return (
          <DataManagement
            lang={lang}
            records={records}
            logs={logs}
            onRestore={handleRestore}
            onLog={addLog}
          />
        );
      default:
        return <Dashboard records={records} user={user} lang={lang} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.DATA_CLERK] },
    { id: 'register', label: t('register'), icon: FilePlus, roles: [UserRole.ADMIN, UserRole.DATA_CLERK, UserRole.CITIZEN] },
    { id: 'records', label: t('records'), icon: FileText, roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.DATA_CLERK] },
    { id: 'status', label: t('status'), icon: TrendingUp, roles: [UserRole.CITIZEN] },
    { id: 'users', label: t('users'), icon: Users, roles: [UserRole.ADMIN] },
    { id: 'audit', label: t('audit'), icon: History, roles: [UserRole.ADMIN] },
    { id: 'data', label: t('dataMgmt'), icon: Database, roles: [UserRole.ADMIN] },
  ];

  const visibleNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <EthiopianFlag className="w-12 h-8 rounded-md shadow-sm" />
          <div className="h-5 w-px bg-slate-700 mx-1"></div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{t('appName')}</h1>
            <p className="text-xs text-slate-400">{t('appSubName')}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleNav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-medium'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <EthiopianFlag className="w-7 h-4 rounded-sm hidden sm:block" />
              <h2 className="text-xl font-semibold text-slate-800">
                {visibleNav.find(n => n.id === activeTab)?.label || t('dashboard')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => changeLanguage('AM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'AM' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                አማ
              </button>
              <button
                onClick={() => changeLanguage('OM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'OM' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                Omo
              </button>
              <button
                onClick={() => changeLanguage('EN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'EN' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                EN
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-slate-500 px-3 border-l border-slate-200 ml-2">
              <MapPin size={16} />
              <span className="text-sm font-medium">Burie, ET</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
