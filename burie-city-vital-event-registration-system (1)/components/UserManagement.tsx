
import React from 'react';
import { Users, UserPlus, Shield, MapPin, Search, Lock } from 'lucide-react';
import { UserRole, User } from '../types';
import { KEBELLES } from '../constants';
import { Language } from '../translations';

// Added lang to UserManagementProps to fix TypeScript error in App.tsx
interface UserManagementProps {
  user: User;
  lang: Language;
  onLog: (action: string, details: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ user, lang, onLog }) => {
  // Mock data for demo
  const systemUsers = [
    { id: '1', name: 'Abebe Bikila', username: 'admin', role: UserRole.ADMIN, lastActive: '2 mins ago' },
    { id: '2', name: 'Sara Lemma', username: 'supervisor', role: UserRole.SUPERVISOR, lastActive: '1 hour ago' },
    { id: '3', name: 'Dawit Solomon', username: 'clerk', role: UserRole.DATA_CLERK, lastActive: 'Active now' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tight">System User Management</h2>
           <p className="text-slate-500 font-medium">Configure roles, permissions, and staff accounts for Burie Registry.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all">
          <UserPlus size={20} /> Create User Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
             <Search size={20} className="text-slate-400" />
             <input type="text" placeholder="Filter users by name, role or username..." className="flex-1 bg-transparent outline-none text-slate-600 font-medium" />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">System Role</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Activity</th>
                       <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {systemUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">@{u.username}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black uppercase text-slate-600 tracking-tighter">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">{u.lastActive}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-blue-600">
                            <Shield size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lock size={120} />
              </div>
              <h3 className="text-xl font-black mb-4 relative z-10">Access Security</h3>
              <p className="text-slate-400 text-sm mb-6 relative z-10">Configure multi-factor authentication and session security parameters for all staff accounts.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all border border-white/10">Security Settings</button>
           </div>

           <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <MapPin size={24} className="text-blue-600" /> Kebele Records
              </h3>
              <div className="space-y-3">
                {KEBELLES.map(k => (
                  <div key={k.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <span className="font-bold text-slate-700">{k.name}</span>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-widest cursor-pointer">Edit Config</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-bold text-sm hover:border-blue-200 hover:text-blue-400 transition-all">
                + Add New Kebele
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
