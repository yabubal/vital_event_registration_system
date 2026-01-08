
import React, { useRef } from 'react';
import { Download, Printer, ShieldCheck, MapPin } from 'lucide-react';
import { VitalEventRecord } from '../types';
import { Language, useTranslation } from '../translations';

interface CertificateViewProps {
  record: VitalEventRecord;
  lang?: Language;
}

// Fixed line 13: Added type assertion 'as Language' to ensure the 'lang' variable matches the expected 'Language' union type.
const CertificateView: React.FC<CertificateViewProps> = ({ record, lang = 'AM' }) => {
  const t = useTranslation(lang as Language);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const getTranslatedType = (type: string) => {
    switch (type) {
      case 'BIRTH': return t('birth');
      case 'DEATH': return t('death');
      case 'MARRIAGE': return t('marriage');
      case 'DIVORCE': return t('divorce');
      default: return type;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-end gap-4 no-print">
         <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
           <Download size={18} /> {t('download')}
         </button>
         <button 
           onClick={handlePrint}
           className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
         >
           <Printer size={18} /> {t('print')}
         </button>
      </div>

      <div 
        ref={printRef}
        className="bg-white p-16 shadow-2xl relative border-[16px] border-slate-100 overflow-hidden"
        style={{ minHeight: '1100px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <ShieldCheck size={500} />
        </div>

        <div className="text-center space-y-4 mb-12 relative z-10">
          <div className="flex justify-center mb-6">
             <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white border-8 border-slate-100">
               <ShieldCheck size={48} />
             </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-[0.2em]">{t('appName')} Administration</h1>
          <h2 className="text-lg font-bold text-slate-600 uppercase tracking-widest">{t('office')}</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <h3 className="text-3xl font-black text-slate-900 pt-4 uppercase tracking-tighter">
             Official {getTranslatedType(record.type)} {t('certificate')}
          </h3>
        </div>

        <div className="flex justify-between items-center mb-12 py-4 border-y border-slate-100 relative z-10">
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Certificate Number</p>
            <p className="text-lg font-mono font-bold text-blue-600">{record.certificateNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Registration Date</p>
            <p className="text-sm font-bold text-slate-800">{new Date(record.registrationDate).toLocaleDateString(lang === 'AM' ? 'am-ET' : 'en-US')}</p>
          </div>
        </div>

        <div className="space-y-12 relative z-10 py-8">
           <p className="text-lg text-slate-700 leading-relaxed text-center italic">
             {lang === 'AM' ? 
               `በቡሬ ከተማ ቀበሌ ${record.kebele} የወሳኝ ኩነቶች ምዝገባ ክፍል በሚገኘው መዝገብ መሠረት የሚከተለው ${getTranslatedType(record.type).toLowerCase()} መመዝገቡን እናረጋግጣለን፡-` : 
               `This is to certify that according to the records maintained by the Civil Registration Office of Kebele ${record.kebele}, Burie City, the following ${getTranslatedType(record.type).toLowerCase()} has been duly registered:`
             }
           </p>

           <div className="grid grid-cols-2 gap-y-8 gap-x-12 px-8">
              {Object.entries(record.data).map(([key, value]: [string, any]) => (
                <div key={key} className="border-b-2 border-slate-100 pb-2">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-xl font-bold text-slate-800">{value}</p>
                </div>
              ))}
              <div className="border-b-2 border-slate-100 pb-2">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Administrative Unit</p>
                <p className="text-xl font-bold text-slate-800">Burie City - Kebele {record.kebele}</p>
              </div>
           </div>
        </div>

        <div className="mt-32 grid grid-cols-2 gap-20 relative z-10">
          <div className="text-center">
             <div className="h-1 bg-slate-200 mb-4"></div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{t('registrarSign')}</p>
             <div className="italic font-serif text-2xl text-slate-300 opacity-50 select-none">Registrar Signature</div>
          </div>
          <div className="flex flex-col items-center justify-center relative">
             <div className="w-32 h-32 rounded-full border-4 border-blue-900/10 flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-dashed border-blue-900/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="text-center">
                  <ShieldCheck className="text-blue-900/20 mx-auto mb-1" size={24} />
                  <p className="text-[8px] font-black text-blue-900/30 uppercase leading-none">OFFICIAL SEAL<br/>BURIE CITY</p>
                </div>
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">{t('adminSeal')}</p>
          </div>
        </div>

        <div className="absolute bottom-16 left-16 right-16 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <p>Any alterations render this certificate void.</p>
          <div className="flex items-center gap-2">
            <MapPin size={10} />
            <span>{t('ethiopia')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
