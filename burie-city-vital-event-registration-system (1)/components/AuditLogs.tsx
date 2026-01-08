
import React from 'react';
import { History, Search, Download, Shield } from 'lucide-react';
import { AuditLog } from '../types';
import { Language } from '../translations';

// Added lang to AuditLogsProps to fix TypeScript error in App.tsx
interface AuditLogsProps {
  logs: AuditLog[];
  lang: Language;
}

const AuditLogs: React.FC<AuditLogsProps> = ({ logs, lang }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">System Audit Trails</h2>
            <p className="text-slate-500 font-medium">Compliance-ready activity logs for accountability.</p>
         </div>
         <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
            <Download size={18} /> Export Log History
         </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Action</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Details</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-500 font-medium">No activity recorded yet.</td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <p className="text-sm font-bold text-slate-700">{new Date(log.timestamp).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                          {log.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{log.userName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {log.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        log.action === 'LOGIN' ? 'bg-blue-50 text-blue-600' :
                        log.action === 'CREATE_RECORD' ? 'bg-emerald-50 text-emerald-600' :
                        log.action === 'UPDATE_RECORD' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-slate-600 font-medium max-w-xs truncate">{log.details}</p>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2 text-emerald-600">
                          <Shield size={14} />
                          <span className="text-[10px] font-bold uppercase">System Verified</span>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
