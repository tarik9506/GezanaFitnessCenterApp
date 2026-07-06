/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Globe, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Dumbbell, 
  Database,
  Lock,
  Unlock,
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { Language, Member, PaymentLog, SmsLog } from './types';
import { translations } from './translations';
import DrmManager from './components/DrmManager';
import SmsSimulator from './components/SmsSimulator';
import MemberForm from './components/MemberForm';
import MemberDetailsModal from './components/MemberDetailsModal';
import SplashScreen from './components/SplashScreen';
import { formatEthiopianDate, addEthiopianMonth } from './utils/ethiopianDate';

// Static initial dataset reflecting typical Ethio-gym setups
const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-1',
    name: 'Abebe Bikila',
    phone: '+251911456789',
    startDate: '2026-05-15',
    monthlyFee: 350,
    paymentStatus: 'paid',
    nextPaymentDate: '2026-07-25',
    isActive: true,
    createdAt: '2026-05-15T09:00:00.000Z'
  },
  {
    id: 'm-2',
    name: 'Selam Hailu',
    phone: '+251922789456',
    startDate: '2026-06-01',
    monthlyFee: 400,
    paymentStatus: 'paid',
    nextPaymentDate: '2026-07-15',
    isActive: true,
    createdAt: '2026-06-01T10:30:00.000Z'
  },
  {
    id: 'm-3',
    name: 'Hagos Gebre',
    phone: '+251914234567',
    startDate: '2026-04-10',
    monthlyFee: 300,
    paymentStatus: 'overdue',
    nextPaymentDate: '2026-06-10',
    isActive: true,
    createdAt: '2026-04-10T08:15:00.000Z'
  },
  {
    id: 'm-4',
    name: 'Almaz Desalegn',
    phone: '+251912987654',
    startDate: '2026-05-05',
    monthlyFee: 350,
    paymentStatus: 'overdue',
    nextPaymentDate: '2026-06-05',
    isActive: true,
    createdAt: '2026-05-05T14:20:00.000Z'
  },
  {
    id: 'm-5',
    name: 'Kidan Yohannes',
    phone: '+251930123456',
    startDate: '2026-03-20',
    monthlyFee: 300,
    paymentStatus: 'paid',
    nextPaymentDate: '2026-07-20',
    isActive: false, // Inactive user
    createdAt: '2026-03-20T11:00:00.000Z'
  }
];

const DEFAULT_DRM_ID = '3F2A5B8C1D9E0F2B';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Offline-first storage synchronization
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('gezana_language') as Language) || 'EN';
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('gezana_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>(() => {
    const saved = localStorage.getItem('gezana_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [smsLogs, setSmsLogs] = useState<SmsLog[]>(() => {
    const saved = localStorage.getItem('gezana_sms_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [authorizedId, setAuthorizedId] = useState<string>(() => {
    return localStorage.getItem('gezana_authorized_id') || DEFAULT_DRM_ID;
  });

  const [currentId, setCurrentId] = useState<string>(() => {
    return localStorage.getItem('gezana_current_id') || DEFAULT_DRM_ID;
  });

  const [simReady, setSimReady] = useState<boolean>(() => {
    const saved = localStorage.getItem('gezana_sim_ready');
    return saved ? JSON.parse(saved) : true;
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterPayment, setFilterPayment] = useState<'all' | 'paid' | 'overdue'>('all');
  
  const [currentView, setCurrentView] = useState<'directory' | 'form'>('directory');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const t = translations[language];

  // Save changes to Local Storage on update
  useEffect(() => {
    localStorage.setItem('gezana_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('gezana_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('gezana_payments', JSON.stringify(paymentLogs));
  }, [paymentLogs]);

  useEffect(() => {
    localStorage.setItem('gezana_sms_logs', JSON.stringify(smsLogs));
  }, [smsLogs]);

  useEffect(() => {
    localStorage.setItem('gezana_authorized_id', authorizedId);
  }, [authorizedId]);

  useEffect(() => {
    localStorage.setItem('gezana_current_id', currentId);
  }, [currentId]);

  useEffect(() => {
    localStorage.setItem('gezana_sim_ready', JSON.stringify(simReady));
  }, [simReady]);

  // Check DRM match
  const isUnlocked = useMemo(() => {
    return authorizedId === currentId;
  }, [authorizedId, currentId]);

  // Auto-scan overdue payments based on Current Date (simulated 2026-07-06 from metadata)
  useEffect(() => {
    const todayStr = '2026-07-06';
    const updated = members.map((member) => {
      if (member.paymentStatus === 'paid' && member.nextPaymentDate < todayStr && member.isActive) {
        return { ...member, paymentStatus: 'overdue' as const };
      }
      return member;
    });
    
    if (JSON.stringify(updated) !== JSON.stringify(members)) {
      setMembers(updated);
    }
  }, [members]);

  // Derived dashboard stats
  const stats = useMemo(() => {
    const active = members.filter(m => m.isActive);
    const paid = active.filter(m => m.paymentStatus === 'paid').length;
    const overdue = active.filter(m => m.paymentStatus === 'overdue').length;
    const estRevenue = active.reduce((acc, m) => acc + m.monthlyFee, 0);

    return {
      total: members.length,
      active: active.length,
      paid,
      overdue,
      revenue: estRevenue
    };
  }, [members]);

  // List of members with expired payment date (to show in SMS reminder queue)
  const pendingReminders = useMemo(() => {
    const todayStr = '2026-07-06';
    return members.filter((m) => {
      return m.isActive && (m.paymentStatus === 'overdue' || m.nextPaymentDate <= todayStr);
    });
  }, [members]);

  // Handle member list filtering & searching
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.phone.includes(searchQuery);
      
      const matchActive = filterActive === 'all' || 
                          (filterActive === 'active' && m.isActive) ||
                          (filterActive === 'inactive' && !m.isActive);
      
      const matchPayment = filterPayment === 'all' || 
                           (filterPayment === 'paid' && m.paymentStatus === 'paid') ||
                           (filterPayment === 'overdue' && m.paymentStatus === 'overdue');

      return matchQuery && matchActive && matchPayment;
    });
  }, [members, searchQuery, filterActive, filterPayment]);

  // CRUD handlers
  const handleSaveMember = (memberData: Omit<Member, 'id' | 'createdAt'> & { id?: string }) => {
    if (memberData.id) {
      // Edit
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberData.id
            ? { ...m, ...memberData }
            : m
        )
      );
      if (selectedMember && selectedMember.id === memberData.id) {
        setSelectedMember((prev) => prev ? { ...prev, ...memberData } : null);
      }
    } else {
      // Add
      const newMember: Member = {
        ...memberData,
        id: `m-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setMembers((prev) => [newMember, ...prev]);
    }
    
    setCurrentView('directory');
    setEditingMember(null);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setSelectedMember(null);
  };

  // Payment logs handler with Ethiopian date extensions
  const handleRecordPayment = (memberId: string, amount: number) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    // Extend next payment due date by exactly 1 Ethiopian month (30 days) from today
    // (or from current due date if it is in the future)
    const currentDateStr = '2026-07-06';
    const targetDue = target.nextPaymentDate;
    const reference = targetDue > currentDateStr ? targetDue : currentDateStr;
    
    const newDueDateStr = addEthiopianMonth(reference);

    // Create Payment Log
    const newLog: PaymentLog = {
      id: `pay-${Date.now()}`,
      memberId,
      memberName: target.name,
      amount,
      paymentDate: new Date().toISOString(),
      dueDateExtendedTo: newDueDateStr
    };

    setPaymentLogs((prev) => [newLog, ...prev]);

    // Update Member Status
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, paymentStatus: 'paid' as const, nextPaymentDate: newDueDateStr }
          : m
      )
    );

    // Update active modal status if open
    setSelectedMember((prev) => 
      prev && prev.id === memberId 
        ? { ...prev, paymentStatus: 'paid' as const, nextPaymentDate: newDueDateStr } 
        : null
    );

    // Auto-generate a thank you SMS receipt!
    if (simReady) {
      const thankYouMsg = language === 'AM'
        ? `ክፍያዎ ተቀብለናል፣ ገዛና ፊትነስ ሴንተርን ስለመረጡ እናመሰግናለን! ${amount} ብር ለቀጣይ ወር እስከ ${formatEthiopianDate(newDueDateStr, 'AM')} ተከፍሏል።`
        : language === 'TI'
        ? `ክፍሊትኩም ተቐቢልና ኣለና፣ ገዛና ፊትነስ ሴንተር ስለዝሓረኹም ነመስግን! ${amount} ብር ንቕጻሊ ወርሒ ክሳብ ${formatEthiopianDate(newDueDateStr, 'TI')} ተኸፊሉ ኣሎ።`
        : `Payment received, thank you for choosing Gezana Fitness Center! ${amount} Birr paid for the next period ending ${formatEthiopianDate(newDueDateStr, 'EN')}.`;

      const newSms: SmsLog = {
        id: `sms-${Date.now()}`,
        memberId,
        memberName: target.name,
        phoneNumber: target.phone,
        message: thankYouMsg,
        sentAt: new Date().toISOString(),
        type: 'receipt',
        status: 'sent'
      };

      setSmsLogs((prev) => [newSms, ...prev]);
    }
  };

  // Local SMS transmitter simulation
  const handleSendSms = (memberId: string, type: 'reminder' | 'receipt', customMsg?: string) => {
    if (!simReady) return;
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    let text = '';
    if (customMsg) {
      text = customMsg;
    } else if (type === 'reminder') {
      text = language === 'AM'
        ? `ሰላም ${target.name}፣ ወርሃዊ የጂም ክፍያ ጊዜዎ አልቋል። እባክዎ የጂም አገልግሎትዎን ለመቀጠል ክፍያዎን ያድሱ። ስለመረጡን እናመሰግናለን! - ገዛና ፊትነስ ሴንተር`
        : language === 'TI'
        ? `ሰላም ${target.name}፣ ወርሓዊ ናይ ጂም ክፍሊት እዋንኩም ወዲእኩም ኣለኹም። በጃኹም ናይ ጂም አገልግሎትኩም ንምቕጻል ክፍሊትኩም ኣሐድሱ። ስለዝመረጽኩምና ነመስግን! - ገዛና ፊትነስ ሴንተር`
        : `Hello ${target.name}, your monthly gym subscription has expired. Please renew your subscription to continue using our services. Thank you for choosing us! - Gezana Fitness Center`;
    } else {
      text = language === 'AM'
        ? `ክፍያዎ ተቀብለናል፣ ገዛና ፊትነስ ሴንተርን ስለመረጡ እናመሰግናለን! ${target.monthlyFee} ብር ለቀጣይ ወር እስከ ${formatEthiopianDate(target.nextPaymentDate, 'AM')} ተከፍሏል።`
        : language === 'TI'
        ? `ክፍሊትኩም ተቐቢልና ኣለና፣ ገዛና ፊትነስ ሴንተር ስለዝሓረኹም ነመስግን! ${target.monthlyFee} ብር ንቕጻሊ ወርሒ ክሳብ ${formatEthiopianDate(target.nextPaymentDate, 'TI')} ተኸፊሉ ኣሎ።`
        : `Payment received, thank you for choosing Gezana Fitness Center! ${target.monthlyFee} Birr paid for the next period ending ${formatEthiopianDate(target.nextPaymentDate, 'EN')}.`;
    }

    const newSms: SmsLog = {
      id: `sms-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      memberId,
      memberName: target.name,
      phoneNumber: target.phone,
      message: text,
      sentAt: new Date().toISOString(),
      type,
      status: 'sent'
    };

    setSmsLogs((prev) => [newSms, ...prev]);
  };

  const handleAutoSendAllReminders = () => {
    if (!simReady || pendingReminders.length === 0) return;

    const newLogs: SmsLog[] = pendingReminders.map((member, idx) => {
      const text = language === 'AM'
        ? `ሰላም ${member.name}፣ ወርሃዊ የጂም ክፍያ ጊዜዎ አልቋል። እባክዎ የጂም አገልግሎትዎን ለመቀጠል ክፍያዎን ያድሱ። ስለመረጡን እናመሰግናለን! - ገዛና ፊትነስ ሴንተር`
        : language === 'TI'
        ? `ሰላም ${member.name}፣ ወርሓዊ ናይ ጂም ክፍሊት እዋንኩም ወዲእኩም ኣለኹም። በጃኹም ናይ ጂም አገልግሎትኩም ንምቕጻል ክፍሊትኩም ኣሐድሱ። ስለዝመረጽኩምና ነመስግን! - ገዛና ፊትነስ ሴንተር`
        : `Hello ${member.name}, your monthly gym subscription has expired. Please renew your subscription to continue using our services. Thank you for choosing us! - Gezana Fitness Center`;

      return {
        id: `sms-${Date.now()}-${idx}`,
        memberId: member.id,
        memberName: member.name,
        phoneNumber: member.phone,
        message: text,
        sentAt: new Date().toISOString(),
        type: 'reminder',
        status: 'sent'
      };
    });

    setSmsLogs((prev) => [...newLogs, ...prev]);
  };

  const handleClearSmsLogs = () => {
    setSmsLogs([]);
  };

  // If splash is true, render the full-screen interactive Splash/Login screen
  if (showSplash) {
    return (
      <SplashScreen
        language={language}
        onLanguageChange={setLanguage}
        onEnter={() => setShowSplash(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none selection:bg-purple-100 selection:text-purple-900">
      
      {/* LOCKED SCREEN (DRM BIND FAILURE) */}
      {!isUnlocked && (
        <div id="drm-locked-fullscreen" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl space-y-6 text-slate-900">
            <div className="flex justify-center">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-full animate-bounce">
                <Lock size={48} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">
                {t.unauthorizedDevice}
              </h1>
              <p className="text-xs font-mono text-purple-600 uppercase tracking-widest font-bold">
                Settings.Secure.ANDROID_ID MISMATCH
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              {t.unauthorizedMsg}
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-2">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">{t.currentAndroidId}</span>
                <span className="text-xs font-mono text-purple-600 font-extrabold tracking-widest">{currentId}</span>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">{t.authorizedAndroidId}</span>
                <span className="text-xs font-mono text-slate-500 font-extrabold tracking-widest">{authorizedId}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="drm-unlock-bypass-btn"
                onClick={() => setAuthorizedId(currentId)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold font-display rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Unlock size={16} />
                Register current Device ID
              </button>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-mono font-semibold">
              <Database size={12} />
              <span>Offline SQLite Locked with Hardware Key</span>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-200 shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl border border-blue-600/20">
              <Dumbbell size={28} className="rotate-[-15deg] transform" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-2">
                {t.appName}
                <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded font-bold uppercase">
                  v1.0.4 APK
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                {t.appSubtitle} (Offline Mode)
              </p>
            </div>
          </div>

          {/* Controls: Language and Splash Return */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Language Toggle Bar */}
            <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex items-center gap-1">
              <div className="p-1.5 text-slate-400" title={t.language}>
                <Globe size={16} />
              </div>
              <button
                id="lang-toggle-en"
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition cursor-pointer ${
                  language === 'EN'
                    ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                id="lang-toggle-am"
                onClick={() => setLanguage('AM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition cursor-pointer ${
                  language === 'AM'
                    ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                አማ
              </button>
              <button
                id="lang-toggle-ti"
                onClick={() => setLanguage('TI')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition cursor-pointer ${
                  language === 'TI'
                    ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ትግ
              </button>
            </div>

            {/* Splash Launcher Screen button */}
            <button
              id="return-to-splash-btn"
              onClick={() => setShowSplash(true)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition border border-slate-200 cursor-pointer"
              title="Return to Splash Screen"
            >
              🔒
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: DIRECTORY & FORMS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STATS STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                <Users size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  {t.totalMembers}
                </span>
                <span className="text-xl font-display font-black text-slate-900">
                  {stats.total}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  {t.paidCount}
                </span>
                <span className="text-xl font-display font-black text-blue-600">
                  {stats.paid}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                <AlertCircle size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  {t.overdueCount}
                </span>
                <span className="text-xl font-display font-black text-purple-600">
                  {stats.overdue}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-100">
                <TrendingUp size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  {t.monthlyRevenue}
                </span>
                <span className="text-xl font-display font-black text-slate-900 font-mono">
                  {stats.revenue} <span className="text-xs font-semibold">{t.currency}</span>
                </span>
              </div>
            </div>
          </div>

          {/* CONDITIONAL SUB-VIEW: DIRECTORY OR FORM */}
          {currentView === 'directory' ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
              
              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                
                {/* Search */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                  </div>
                  <input
                    id="search-input"
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-inner font-semibold"
                  />
                </div>

                {/* Dropdowns & Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Dropdown Active */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-xs shadow-sm">
                    <Filter size={12} className="text-slate-400" />
                    <select
                      id="filter-active-select"
                      value={filterActive}
                      onChange={(e) => setFilterActive(e.target.value as any)}
                      className="bg-transparent text-slate-700 font-bold focus:outline-none cursor-pointer pr-1"
                    >
                      <option value="all">{t.allMembers}</option>
                      <option value="active">{t.activeMembers}</option>
                      <option value="inactive">{t.inactiveMembers}</option>
                    </select>
                  </div>

                  {/* Dropdown Payments */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-xs shadow-sm">
                    <Filter size={12} className="text-slate-400" />
                    <select
                      id="filter-payment-select"
                      value={filterPayment}
                      onChange={(e) => setFilterPayment(e.target.value as any)}
                      className="bg-transparent text-slate-700 font-bold focus:outline-none cursor-pointer pr-1"
                    >
                      <option value="all">All Payments</option>
                      <option value="paid">{t.paid}</option>
                      <option value="overdue">{t.overdue}</option>
                    </select>
                  </div>

                  {/* Add Member button */}
                  <button
                    id="add-member-dashboard-btn"
                    onClick={() => {
                      setEditingMember(null);
                      setCurrentView('form');
                    }}
                    className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold font-display rounded-xl text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={3} />
                    {t.addMember}
                  </button>

                </div>
              </div>

              {/* Members table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table id="members-table" className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                      <th className="py-3.5 px-4">{t.fullName}</th>
                      <th className="py-3.5 px-4">{t.phoneNumber}</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">{t.startingDate}</th>
                      <th className="py-3.5 px-4">{t.paymentStatus}</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">{t.nextPaymentDue}</th>
                      <th className="py-3.5 px-4 text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <tr
                          key={member.id}
                          className={`hover:bg-slate-50/50 transition cursor-pointer ${
                            !member.isActive ? 'opacity-60' : ''
                          }`}
                          onClick={() => setSelectedMember(member)}
                        >
                          {/* Name */}
                          <td className="py-4 px-4 font-display font-semibold text-slate-900 text-sm">
                            <div className="flex items-center gap-2">
                              <span>{member.name}</span>
                              {!member.isActive && (
                                <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">
                                  {t.inactiveMembers}
                                </span>
                              )}
                            </div>
                          </td>
                          {/* Phone */}
                          <td className="py-4 px-4 font-mono text-xs text-slate-500">
                            {member.phone}
                          </td>
                          {/* Ethiopian Starting Date */}
                          <td className="py-4 px-4 text-xs text-slate-500 font-semibold hidden md:table-cell">
                            {formatEthiopianDate(member.startDate, language)}
                          </td>
                          {/* Payment status badge */}
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              member.paymentStatus === 'paid'
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : 'bg-purple-50 text-purple-700 border border-purple-100'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${member.paymentStatus === 'paid' ? 'bg-blue-600' : 'bg-purple-600'}`} />
                              {member.paymentStatus === 'paid' ? t.paid : t.overdue}
                            </span>
                          </td>
                          {/* Next payment due (Ethiopian formatted) */}
                          <td className="py-4 px-4 text-xs font-bold hidden md:table-cell">
                            <span className={member.paymentStatus === 'overdue' ? 'text-purple-600' : 'text-blue-600'}>
                              {formatEthiopianDate(member.nextPaymentDate, language)}
                            </span>
                          </td>
                          {/* Row Actions */}
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                id={`record-pay-row-btn-${member.id}`}
                                onClick={() => handleRecordPayment(member.id, member.monthlyFee)}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 border border-blue-100 hover:border-blue-600 shadow-sm cursor-pointer"
                                title={t.recordPayment}
                              >
                                {t.recordPayment}
                              </button>
                              <button
                                id={`edit-row-btn-${member.id}`}
                                onClick={() => {
                                  setEditingMember(member);
                                  setCurrentView('form');
                                }}
                                className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-950 rounded-lg transition border border-transparent hover:border-slate-200 cursor-pointer"
                                title={t.editMember}
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                id={`delete-row-btn-${member.id}`}
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete member ${member.name}?`)) {
                                    handleDeleteMember(member.id);
                                  }
                                }}
                                className="p-2 hover:bg-purple-50 text-purple-600 hover:text-purple-700 rounded-lg transition border border-transparent hover:border-purple-200 cursor-pointer"
                                title={t.delete}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                          No members found matching filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Status footer inside table */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-inner">
                <div className="flex gap-2 text-[10px] text-slate-500 font-semibold font-mono">
                  <Database size={14} className="text-slate-400 shrink-0" />
                  <span>SQLite database synchronized locally inside Room Persistence Layer. Encryption active.</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 font-bold">
                  Current Date: <strong className="text-slate-800">2026-07-06</strong>
                </div>
              </div>

            </div>
          ) : (
            /* MEMBER FORM VIEW CONTAINER */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">
              <MemberForm
                language={language}
                member={editingMember}
                onSave={handleSaveMember}
                onCancel={() => {
                  setCurrentView('directory');
                  setEditingMember(null);
                }}
              />
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: SMS SIMULATOR & DRM PANELS */}
        <div className="space-y-6">
          
          {/* SMS TRANSMITTER SIMULATION PANEL */}
          <SmsSimulator
            language={language}
            smsLogs={smsLogs}
            pendingReminders={pendingReminders}
            simReady={simReady}
            onToggleSim={() => setSimReady(!simReady)}
            onSendSms={handleSendSms}
            onClearLogs={handleClearSmsLogs}
            onAutoSendAll={handleAutoSendAllReminders}
          />

          {/* DEVICE-SPECIFIC DRM LICENSING PANEL */}
          <DrmManager
            language={language}
            authorizedId={authorizedId}
            currentId={currentId}
            onUpdateIds={(auth, curr) => {
              setAuthorizedId(auth);
              setCurrentId(curr);
            }}
            isUnlocked={isUnlocked}
          />

        </div>

      </main>

      {/* MEMBER DETAILS MODAL OVERLAY */}
      {selectedMember && (
        <MemberDetailsModal
          language={language}
          member={selectedMember}
          paymentLogs={paymentLogs}
          onClose={() => setSelectedMember(null)}
          onEdit={() => {
            setEditingMember(selectedMember);
            setSelectedMember(null);
            setCurrentView('form');
          }}
          onRecordPayment={handleRecordPayment}
          onSendSms={handleSendSms}
          simReady={simReady}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-semibold font-mono uppercase">
          <div>
            &copy; 2026 Gezana Fitness Center. All Rights Reserved. Offline SQLite Encryption &amp; SIM SMS engine active.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500"><Sparkles size={12} className="text-purple-600" /> Zero Cloud Overhead</span>
            <span className="flex items-center gap-1 text-slate-500">🔒 Hardware-locked (Settings.Secure.ANDROID_ID)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
