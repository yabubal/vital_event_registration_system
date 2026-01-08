
import React, { useRef, useState } from 'react';
import { Database, Download, Upload, Trash2, ShieldAlert, FileJson, CheckCircle2, Code, Copy, Check, FileCode, Info, Settings, Type } from 'lucide-react';
import { Language, useTranslation } from '../translations';
import { VitalEventRecord, AuditLog } from '../types';

interface DataManagementProps {
  lang: Language;
  records: VitalEventRecord[];
  logs: AuditLog[];
  onRestore: (data: { records: VitalEventRecord[], logs: AuditLog[] }) => void;
  onLog: (action: string, details: string) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ lang, records, logs, onRestore, onLog }) => {
  const t = useTranslation(lang);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'sql' | 'guide'>('sql');

  // Strictly MySQL 8.0+ Schema
  const mysqlSchema = `-- BURIE CITY VITAL EVENTS REGISTRATION SYSTEM
-- DATABASE: MySQL 8.0+
-- CHARACTER SET: utf8mb4 (Required for Amharic)

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE DATABASE IF NOT EXISTS burie_vital_events CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE burie_vital_events;

-- 1. KEBELLES TABLE
CREATE TABLE IF NOT EXISTS kebeles (
    kebele_id VARCHAR(10) NOT NULL,
    name_am VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    PRIMARY KEY (kebele_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
    role ENUM('ADMIN', 'SUPERVISOR', 'DATA_CLERK', 'CITIZEN') NOT NULL,
    kebele_id VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY (username),
    CONSTRAINT fk_user_kebele FOREIGN KEY (kebele_id) REFERENCES kebeles (kebele_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. MAIN VITAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS vital_records (
    record_id VARCHAR(50) NOT NULL,
    event_type ENUM('BIRTH', 'DEATH', 'MARRIAGE', 'DIVORCE') NOT NULL,
    kebele_id VARCHAR(10) NOT NULL,
    status ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    registration_date DATETIME NOT NULL,
    applicant_id VARCHAR(50) NOT NULL,
    certificate_number VARCHAR(100),
    rejection_reason TEXT CHARACTER SET utf8mb4,
    metadata JSON,
    PRIMARY KEY (record_id),
    UNIQUE KEY (certificate_number),
    CONSTRAINT fk_record_kebele FOREIGN KEY (kebele_id) REFERENCES kebeles (kebele_id),
    CONSTRAINT fk_record_applicant FOREIGN KEY (applicant_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INITIAL DATA: BURIE CITY KEBELLES
INSERT INTO kebeles (kebele_id, name_am, name_en) VALUES 
('01', 'ቀበሌ 01', 'Kebele 01'),
('02', 'ቀበሌ 02', 'Kebele 02'),
('03', 'ቀበሌ 03', 'Kebele 03'),
('04', 'ቀበሌ 04', 'Kebele 04'),
('05', 'ቀበሌ 05', 'Kebele 05'),
('06', 'ቀበሌ 06', 'Kebele 06'),
('07', 'ቀበሌ 07', 'Kebele 07'),
('08', 'ቀበሌ 08', 'Kebele 08')
ON DUPLICATE KEY UPDATE name_en=VALUES(name_en);

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;`;

  const handleCopy = () => {
    const cleanText = mysqlSchema.trim();
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onLog('COPY_SQL', 'Admin copied clean MySQL schema to clipboard.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Database size={200} /></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-black mb-4 tracking-tight">MySQL Server Setup</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Configure your professional database environment. Follow the guide to ensure <strong>Amharic Unicode</strong> is handled correctly.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-50 p-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex p-1 bg-slate-200 rounded-2xl">
            <button
              onClick={() => setActiveView('sql')}
              className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'sql' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Code size={18} /> SQL Script
            </button>
            <button
              onClick={() => setActiveView('guide')}
              className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'guide' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Info size={18} /> Workbench Guide
            </button>
          </div>

          {activeView === 'sql' && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all mr-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          )}
        </div>

        <div className="p-0 min-h-[400px]">
          {activeView === 'sql' ? (
            <pre className="p-8 bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed select-all">
              {mysqlSchema}
            </pre>
          ) : (
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Settings size={24} /></div>
                  <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">1. Connection</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Right-click your connection {'>'} <strong>Edit Connection</strong> {'>'} <strong>Advanced</strong>. In the <strong>Others</strong> field, add: <br />
                    <code className="bg-white border px-2 py-1 rounded mt-2 block font-bold text-blue-600">OPT_CHARSET_NAME=utf8mb4</code>
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><Database size={24} /></div>
                  <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">2. Defaults</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Go to <strong>Edit</strong> {'>'} <strong>Preferences</strong> {'>'} <strong>Modeling</strong> {'>'} <strong>MySQL</strong>. Set <strong>Default Collation</strong> to: <br />
                    <code className="bg-white border px-2 py-1 rounded mt-2 block font-bold text-emerald-600">utf8mb4_0900_ai_ci</code>
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center"><Type size={24} /></div>
                  <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">3. Font View</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Go to <strong>Preferences</strong> {'>'} <strong>Appearance</strong>. Change the <strong>Editor Font</strong> to a font that supports Ethiopic characters like: <br />
                    <code className="bg-white border px-2 py-1 rounded mt-2 block font-bold text-purple-600">Nyala, Abyssinica SIL, or Noto Sans</code>
                  </p>
                </div>
              </div>

              <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl flex items-start gap-4">
                <ShieldAlert className="text-amber-600 shrink-0" size={24} />
                <p className="text-sm text-amber-900 font-medium">
                  <strong>Why utf8mb4?</strong> Amharic characters require 4-byte storage. Standard UTF-8 in MySQL only supports 3 bytes. Always use <code>utf8mb4</code> for Ethiopian languages.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-xl flex flex-col space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Download size={32} /></div>
          <h3 className="text-2xl font-black text-slate-800">Local JSON Backup</h3>
          <p className="text-slate-500 font-medium text-sm">Download your current records as a JSON file before migrating to MySQL.</p>
          <button
            onClick={() => {
              const data = { version: "2.1", exportDate: new Date().toISOString(), records, logs };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `burie_backup_${new Date().toISOString().split('T')[0]}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              onLog('EXPORT_DATABASE', 'Admin exported a JSON backup.');
            }}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
          >
            <FileJson size={20} /> Export Records
          </button>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-xl flex flex-col space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Upload size={32} /></div>
          <h3 className="text-2xl font-black text-slate-800">Restore Data</h3>
          <p className="text-slate-500 font-medium text-sm">Restore from a previous backup if you need to roll back changes.</p>
          <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const json = JSON.parse(event.target?.result as string);
                if (json.records && Array.isArray(json.records)) {
                  if (window.confirm('Restore system from backup?')) {
                    onRestore({ records: json.records, logs: json.logs || [] });
                    onLog('IMPORT_DATABASE', 'Admin restored system from backup.');
                    alert('Restore successful.');
                  }
                }
              } catch (err) { alert('Invalid backup file.'); }
            };
            reader.readAsText(file);
          }} />
          <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"><CheckCircle2 size={20} /> Import Backup</button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
