
import React, { useState, useEffect } from 'react';
import { 
  Baby, 
  Skull, 
  Heart, 
  XCircle, 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  CheckCircle2,
  MapPin,
  ClipboardCheck,
  Users,
  FilePlus,
  Milestone,
  FileText
} from 'lucide-react';
import { EventType, RegistrationStatus, User as UserType, VitalEventRecord } from '../types';
import { KEBELLES } from '../constants';
import { Language, useTranslation } from '../translations';

interface RegistrationFormProps {
  user: UserType;
  lang: Language;
  onSubmit: (record: VitalEventRecord) => void;
}

// Sub-component for individual file preview to handle local URL lifecycle
const FileItem: React.FC<{ file: File; onRemove: () => void; lang: Language }> = ({ file, onRemove, lang }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="group relative flex flex-col p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-all overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="h-32 w-full rounded-xl bg-slate-50 flex items-center justify-center mb-3 overflow-hidden relative border border-slate-100">
        {preview ? (
          <img src={preview} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-300">
            <FileText size={32} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Document</span>
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors pointer-events-none" />
      </div>
      
      <div className="space-y-1 pr-8">
        <p className="font-bold text-slate-700 text-xs truncate leading-tight" title={file.name}>
          {file.name}
        </p>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400">
          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{file.type.split('/')[1] || 'FILE'}</span>
          <span>{formatSize(file.size)}</span>
        </div>
      </div>

      <button 
        onClick={(e) => { e.preventDefault(); onRemove(); }}
        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
        title={lang === 'AM' ? 'አጥፋ' : 'Remove'}
      >
        <XCircle size={16} />
      </button>
    </div>
  );
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({ user, lang, onSubmit }) => {
  const t = useTranslation(lang);
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [kebele, setKebele] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (step === 1 && (!eventType || !kebele)) {
      setError(lang === 'AM' ? 'እባክዎ የምዝገባ አይነት እና ቀበሌ ይምረጡ።' : 'Please select both an event type and a kebele.');
      return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError(lang === 'AM' ? 'ቢያንስ አንድ ሰነድ መያያዝ አለበት።' : 'At least one document upload is required.');
      return;
    }

    const record: VitalEventRecord = {
      id: `REG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      type: eventType!,
      kebele,
      status: RegistrationStatus.PENDING,
      registrationDate: new Date().toISOString(),
      applicantId: user.id,
      data: formData,
      documents: files.map(f => ({ name: f.name, type: f.type, url: '#' })),
      auditTrail: []
    };

    onSubmit(record);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      setError('');
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderBirthForm = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
          <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
            <Baby size={20} /> {t('birth')} - {lang === 'AM' ? 'የሕፃኑ መረጃ' : "Child's Details"}
          </h3>
          <FormField label={t('fullName')} value={formData.fullName} onChange={(val) => updateFormData('fullName', val)} required />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              label={t('gender')} 
              options={[{v:'Male',l:lang==='AM'?'ወንድ':'Male'}, {v:'Female',l:lang==='AM'?'ሴት':'Female'}]} 
              value={formData.gender} 
              onChange={(val) => updateFormData('gender', val)} 
            />
            <FormField label={t('dob')} type="date" value={formData.dob} onChange={(val) => updateFormData('dob', val)} required />
          </div>
          <FormField label={t('pob')} value={formData.placeOfBirth} onChange={(val) => updateFormData('placeOfBirth', val)} />
          <FormField label={t('nationality')} value={formData.nationality || 'Ethiopian'} onChange={(val) => updateFormData('nationality', val)} />
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Users size={20} /> {t('fatherName')}
          </h3>
          <FormField label={t('fullName')} value={formData.fatherName} onChange={(val) => updateFormData('fatherName', val)} />
          <FormField label={t('nationality')} value={formData.fatherNationality} onChange={(val) => updateFormData('fatherNationality', val)} />
          <FormField label={t('occupation')} value={formData.fatherOccupation} onChange={(val) => updateFormData('fatherOccupation', val)} />
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Users size={20} /> {t('motherName')}
          </h3>
          <FormField label={t('fullName')} value={formData.motherName} onChange={(val) => updateFormData('motherName', val)} />
          <FormField label={t('nationality')} value={formData.motherNationality} onChange={(val) => updateFormData('motherNationality', val)} />
          <FormField label={t('occupation')} value={formData.motherOccupation} onChange={(val) => updateFormData('motherOccupation', val)} />
        </div>
      </div>
    </div>
  );

  const renderDeathForm = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-4">
          <h3 className="font-bold text-rose-800 flex items-center gap-2">
            <Skull size={20} /> {lang === 'AM' ? 'ሟች መረጃ' : 'Deceased Information'}
          </h3>
          <FormField label={t('fullName')} value={formData.fullName} onChange={(val) => updateFormData('fullName', val)} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label={lang === 'AM' ? 'የሞተበት ቀን' : 'Date of Death'} type="date" value={formData.dod} onChange={(val) => updateFormData('dod', val)} required />
            <FormField label={t('gender')} value={formData.gender} onChange={(val) => updateFormData('gender', val)} />
          </div>
          <FormField label={lang === 'AM' ? 'የሞተበት ቦታ' : 'Place of Death'} value={formData.pob} onChange={(val) => updateFormData('pob', val)} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('nationality')} value={formData.nationality} onChange={(val) => updateFormData('nationality', val)} />
            <FormField label={t('religion')} value={formData.religion} onChange={(val) => updateFormData('religion', val)} />
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle size={20} /> {lang === 'AM' ? 'ተጨማሪ መረጃ' : 'Additional Context'}
          </h3>
          <FormField label={t('maritalStatus')} value={formData.maritalStatus} onChange={(val) => updateFormData('maritalStatus', val)} />
          <FormField label={t('occupation')} value={formData.occupation} onChange={(val) => updateFormData('occupation', val)} />
          <FormField label={t('education')} value={formData.education} onChange={(val) => updateFormData('education', val)} />
          <FormField label={t('reason')} value={formData.cause} onChange={(val) => updateFormData('cause', val)} />
        </div>
      </div>
    </div>
  );

  const renderMarriageForm = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-4">
          <h3 className="font-bold text-pink-800">{lang === 'AM' ? 'የሙሽራው መረጃ' : 'Groom Details'}</h3>
          <FormField label={t('fullName')} value={formData.groomName} onChange={(val) => updateFormData('groomName', val)} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('dob')} type="date" value={formData.groomDob} onChange={(val) => updateFormData('groomDob', val)} />
            <FormField label={t('nationality')} value={formData.groomNationality} onChange={(val) => updateFormData('groomNationality', val)} />
          </div>
          <FormField label={t('occupation')} value={formData.groomOccupation} onChange={(val) => updateFormData('groomOccupation', val)} />
        </div>

        <div className="p-6 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-4">
          <h3 className="font-bold text-pink-800">{lang === 'AM' ? 'የሙሽሪት መረጃ' : 'Bride Details'}</h3>
          <FormField label={t('fullName')} value={formData.brideName} onChange={(val) => updateFormData('brideName', val)} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('dob')} type="date" value={formData.brideDob} onChange={(val) => updateFormData('brideDob', val)} />
            <FormField label={t('nationality')} value={formData.brideNationality} onChange={(val) => updateFormData('brideNationality', val)} />
          </div>
          <FormField label={t('occupation')} value={formData.brideOccupation} onChange={(val) => updateFormData('brideOccupation', val)} />
        </div>

        <div className="md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3"><h3 className="font-bold text-slate-800 mb-2">{lang === 'AM' ? 'የጋብቻ መረጃ' : 'Event Information'}</h3></div>
          <FormField label={lang === 'AM' ? 'የጋብቻ ቀን' : 'Marriage Date'} type="date" value={formData.dom} onChange={(val) => updateFormData('dom', val)} required />
          <FormField label={t('religion')} value={formData.marriageReligion} onChange={(val) => updateFormData('marriageReligion', val)} />
          <FormField label={t('witnesses')} value={formData.witnesses} onChange={(val) => updateFormData('witnesses', val)} />
        </div>
      </div>
    </div>
  );

  const renderDivorceForm = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-4">
          <h3 className="font-bold text-purple-800">{lang === 'AM' ? 'የባለጉዳዩ መረጃ' : 'Applicant Information'}</h3>
          <FormField label={t('fullName')} value={formData.applicantName} onChange={(val) => updateFormData('applicantName', val)} required />
          <FormField label={t('nationality')} value={formData.applicantNationality} onChange={(val) => updateFormData('applicantNationality', val)} />
          <FormField label={t('occupation')} value={formData.applicantOccupation} onChange={(val) => updateFormData('applicantOccupation', val)} />
        </div>

        <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-4">
          <h3 className="font-bold text-purple-800">{lang === 'AM' ? 'የባልደረባ መረጃ' : 'Spouse Information'}</h3>
          <FormField label={t('fullName')} value={formData.spouseName} onChange={(val) => updateFormData('spouseName', val)} required />
          <FormField label={t('nationality')} value={formData.spouseNationality} onChange={(val) => updateFormData('spouseNationality', val)} />
        </div>

        <div className="md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label={lang === 'AM' ? 'የፍቺ ቀን' : 'Divorce Date'} type="date" value={formData.dodiv} onChange={(val) => updateFormData('dodiv', val)} required />
          <FormField label={t('numChildren')} type="number" value={formData.childrenCount} onChange={(val) => updateFormData('childrenCount', val)} />
          <FormField label={t('reason')} value={formData.divorceReason} onChange={(val) => updateFormData('divorceReason', val)} />
        </div>
      </div>
    </div>
  );

  const renderEventSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in duration-300">
      {[
        { type: EventType.BIRTH, icon: Baby, label: t('birth'), color: 'blue' },
        { type: EventType.DEATH, icon: Skull, label: t('death'), color: 'red' },
        { type: EventType.MARRIAGE, icon: Heart, label: t('marriage'), color: 'pink' },
        { type: EventType.DIVORCE, icon: XCircle, label: t('divorce'), color: 'purple' },
      ].map((event) => (
        <button
          key={event.type}
          onClick={() => setEventType(event.type)}
          className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
            eventType === event.type 
            ? `border-${event.color}-500 bg-${event.color}-50/50 shadow-lg scale-105` 
            : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <div className={`p-4 rounded-full bg-${event.color}-100 text-${event.color}-600`}>
            <event.icon size={32} />
          </div>
          <span className="font-bold text-slate-800">{event.label}</span>
          {eventType === event.type && (
            <div className={`absolute top-4 right-4 text-${event.color}-500`}>
              <CheckCircle2 size={24} />
            </div>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 max-w-5xl mx-auto mb-12">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-400'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-16 h-1 mx-2 rounded-full ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === 'AM' ? 'ደረጃ' : 'Step'} {step}</p>
            <p className="text-sm font-bold text-slate-700">
              {step === 1 ? t('register') : step === 2 ? (lang === 'AM' ? 'ዝርዝር መረጃ' : 'Detailed Info') : (lang === 'AM' ? 'ሰነዶች' : 'Documents')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200">
           <Milestone size={18} className="text-blue-500" />
           <span className="text-sm font-bold text-slate-700">Burie Registry V2.0</span>
        </div>
      </div>

      <div className="p-10">
        {step === 1 && (
          <div className="space-y-10">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-3xl font-black text-slate-800 mb-3">{t('welcome')}</h2>
              <p className="text-slate-500">{lang === 'AM' ? 'ለቡሬ ከተማ ነዋሪዎች የወሳኝ ኩነቶች ምዝገባ ስርዓት።' : 'Official Civil Registration System for Burie City Citizens.'}</p>
            </div>
            
            {renderEventSelection()}

            <div className="space-y-4 max-w-md mx-auto">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <MapPin size={14} /> {t('kebele')}
              </label>
              <select 
                value={kebele}
                onChange={(e) => setKebele(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none font-bold text-slate-700"
              >
                <option value="">{t('kebele')} {lang === 'AM' ? 'ይምረጡ' : 'Select'}</option>
                {KEBELLES.map(k => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-slate-800">{t('register')} - {eventType}</h2>
               <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase">Compliance Form NCRRA-ET</div>
            </div>
            
            {eventType === EventType.BIRTH && renderBirthForm()}
            {eventType === EventType.DEATH && renderDeathForm()}
            {eventType === EventType.MARRIAGE && renderMarriageForm()}
            {eventType === EventType.DIVORCE && renderDivorceForm()}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-3xl font-black text-slate-800 mb-3">{lang === 'AM' ? 'ሰነዶች ማያያዣ' : 'Supporting Evidence'}</h2>
              <p className="text-slate-500">{lang === 'AM' ? 'እባክዎ ለምዝገባው አስፈላጊ የሆኑ ሰነዶችን (የቀበሌ መታወቂያ፣ የሆስፒታል ደብዳቤ ወዘተ) ያያይዙ።' : 'Please upload mandatory documents such as Kebele ID, Hospital Notifications, or Court Orders.'}</p>
            </div>

            <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-16 text-center hover:border-blue-300 transition-all bg-slate-50/50 group cursor-pointer relative">
              <input 
                type="file" 
                multiple 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                id="file-upload" 
                onChange={handleFileChange} 
              />
              <div className="flex flex-col items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-xl text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Upload size={40} /></div>
                <div>
                  <p className="text-2xl font-black text-slate-800">{lang === 'AM' ? 'ፋይል እዚህ ይጣሉ' : 'Drop Files Here'}</p>
                  <p className="text-slate-500 font-medium">PNG, JPG, PDF up to 10MB each</p>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">
                    {lang === 'AM' ? 'የተያያዙ ሰነዶች' : 'Uploaded Documents'} ({files.length})
                  </h3>
                  <button 
                    onClick={() => setFiles([])}
                    className="text-[10px] font-black uppercase text-rose-500 hover:underline"
                  >
                    {lang === 'AM' ? 'ሁሉንም አጥፋ' : 'Clear All'}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, i) => (
                    <FileItem 
                      key={`${file.name}-${i}`} 
                      file={file} 
                      onRemove={() => removeFile(i)} 
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-3xl flex items-start gap-4">
               <ClipboardCheck className="text-emerald-600 shrink-0 mt-1" size={24} />
               <div>
                  <h4 className="font-black text-emerald-800 uppercase tracking-widest text-xs mb-2">{lang === 'AM' ? 'ማረጋገጫ' : 'Legal Declaration'}</h4>
                  <p className="text-sm text-emerald-700 leading-relaxed font-medium italic">
                    {lang === 'AM' ? 
                      "እኔ ከላይ የተጠቀሱት መረጃዎች በሙሉ ትክክለኛ መሆናቸውን እና በኢትዮጵያ የወሳኝ ኩነቶች ምዝገባ ህግ መሠረት የቀረቡ መሆናቸውን አረጋግጣለሁ።" : 
                      "I hereby certify that the information provided is true, accurate, and submitted in compliance with the Civil Registration laws of the Federal Democratic Republic of Ethiopia."
                    }
                  </p>
               </div>
            </div>
          </div>
        )}

        {error && <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-bold animate-pulse"><AlertCircle size={20} />{error}</div>}

        <div className="mt-12 flex items-center justify-between pt-10 border-t border-slate-100">
          {step > 1 ? (
            <button onClick={handleBack} className="px-8 py-4 rounded-2xl border-2 border-slate-100 font-black text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2 group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {lang === 'AM' ? 'ተመለስ' : 'Back'}
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <button onClick={handleNext} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-2xl shadow-blue-200 flex items-center gap-2 group transition-all">
              {lang === 'AM' ? 'ቀጥል' : 'Continue'} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button onClick={handleSubmit} className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-emerald-700 shadow-2xl shadow-emerald-200 flex items-center gap-2 group transition-all">
              {lang === 'AM' ? 'መረጃውን ላክ' : 'Submit Registration'} <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const FormField: React.FC<{ label: string; type?: string; value: any; onChange: (val: any) => void; required?: boolean }> = ({ 
  label, type = "text", value, onChange, required 
}) => (
  <div className="space-y-2">
    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label} {required && <span className="text-rose-500">*</span>}</label>
    <input 
      type={type} 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700 placeholder-slate-300" 
      placeholder={`Enter ${label}...`}
      required={required} 
    />
  </div>
);

const FormSelect: React.FC<{ label: string; options: {v:string,l:string}[]; value: any; onChange: (val: any) => void }> = ({ 
  label, options, value, onChange 
}) => (
  <div className="space-y-2">
    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
    >
      <option value="">Select...</option>
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

export default RegistrationForm;
