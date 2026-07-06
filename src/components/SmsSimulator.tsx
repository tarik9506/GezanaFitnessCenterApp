/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Smartphone, Wifi, Radio, AlertCircle, History, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';
import { Language, SmsLog, Member } from '../types';
import { translations } from '../translations';
import { formatEthiopianDate } from '../utils/ethiopianDate';

interface SmsSimulatorProps {
  language: Language;
  smsLogs: SmsLog[];
  pendingReminders: Member[];
  simReady: boolean;
  onToggleSim: () => void;
  onSendSms: (memberId: string, type: 'reminder' | 'receipt', customMsg?: string) => void;
  onClearLogs: () => void;
  onAutoSendAll: () => void;
}

export default function SmsSimulator({
  language,
  smsLogs,
  pendingReminders,
  simReady,
  onToggleSim,
  onSendSms,
  onClearLogs,
  onAutoSendAll,
}: SmsSimulatorProps) {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

  return (
    <div id="sms-simulator-panel" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col h-[520px] text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="font-display font-black text-base text-slate-900 leading-tight">
              {t.smsEngine}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Android SmsManager Simulator
            </p>
          </div>
        </div>

        {/* Local SIM controller */}
        <button
          id="toggle-sim-btn"
          onClick={onToggleSim}
          className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-mono font-black transition border cursor-pointer ${
            simReady
              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
          }`}
        >
          {simReady ? (
            <>
              <Radio size={12} className="animate-pulse" />
              SIM Connected
            </>
          ) : (
            <>
              <AlertCircle size={12} />
              No SIM Card (Blocked)
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1 mb-4 shrink-0 shadow-inner border border-slate-200/50">
        <button
          id="sms-tab-queue"
          onClick={() => setActiveTab('queue')}
          className={`flex-1 py-2 rounded-lg text-[11px] font-bold font-display transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-white text-slate-800 shadow border border-slate-200/40'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare size={13} />
          Queue ({pendingReminders.length})
        </button>
        <button
          id="sms-tab-history"
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-lg text-[11px] font-bold font-display transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-white text-slate-800 shadow border border-slate-200/40'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <History size={13} />
          Logs ({smsLogs.length})
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        {activeTab === 'queue' ? (
          <div className="space-y-3 h-full flex flex-col">
            {pendingReminders.length > 0 ? (
              <>
                <div className="shrink-0 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-1 shadow-sm">
                  <div className="text-[10px] text-slate-500 font-medium">
                    <span className="font-extrabold text-purple-600">{pendingReminders.length}</span> members overdue or due today.
                  </div>
                  <button
                    id="auto-send-reminders-btn"
                    onClick={onAutoSendAll}
                    disabled={!simReady}
                    className="py-1.5 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-[10px] font-extrabold rounded-xl transition shadow-md cursor-pointer shrink-0"
                  >
                    Send All (SIM)
                  </button>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {pendingReminders.map((member) => (
                    <div
                      key={member.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between transition gap-2 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{member.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{member.phone}</p>
                        </div>
                        <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono">
                          {formatEthiopianDate(member.nextPaymentDate, language)}
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl text-[10px] text-slate-600 font-medium leading-relaxed italic border border-slate-200 border-l-4 border-l-purple-500 shadow-inner">
                        {language === 'AM' && `ሰላም ${member.name}፣ ወርሃዊ የጂም ክፍያ ጊዜዎ አልቋል። እባክዎ የጂም አገልግሎትዎን ለመቀጠል ክፍያዎን ያድሱ። ስለመረጡን እናመሰግናለን! - ገዛና ፊትነስ ሴንተር`}
                        {language === 'TI' && `ሰላም ${member.name}፣ ወርሓዊ ናይ ጂም ክፍሊት እዋንኩም ወዲእኩም ኣለኹም። በጃኹም ናይ ጂም አገልግሎትኩም ንምቕጻል ክፍሊትኩም ኣሐድሱ። ስለዝመረጽኩምና ነመስግን! - ገዛና ፊትነስ ሴንተር`}
                        {language === 'EN' && `Hello ${member.name}, your monthly gym subscription has expired. Please renew your subscription to continue using our services. Thank you for choosing us! - Gezana Fitness Center`}
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <a
                          id={`sms-real-link-${member.id}`}
                          href={`sms:${member.phone}?body=${encodeURIComponent(
                            language === 'AM'
                              ? `ሰላም ${member.name}፣ ወርሃዊ የጂም ክፍያ ጊዜዎ አልቋል። እባክዎ የጂም አገልግሎትዎን ለመቀጠል ክፍያዎን ያድሱ። ስለመረጡን እናመሰግናለን! - ገዛና ፊትነስ ሴንተር`
                              : language === 'TI'
                              ? `ሰላም ${member.name}፣ ወርሓዊ ናይ ጂም ክፍሊት እዋንኩም ወዲእኩም ኣለኹም። በጃኹም ናይ ጂም አገልግሎትኩም ንምቕጻል ክፍሊትኩም ኣሐድሱ። ስለዝመረጽኩምና ነመስግን! - ገዛና ፊትነስ ሴንተር`
                              : `Hello ${member.name}, your monthly gym subscription has expired. Please renew your subscription to continue using our services. Thank you for choosing us! - Gezana Fitness Center`
                          )}`}
                          className="py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-[9px] font-bold transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                        >
                          <Smartphone size={10} />
                          Open Messages App
                        </a>

                        <button
                          id={`sms-send-sim-btn-${member.id}`}
                          onClick={() => onSendSms(member.id, 'reminder')}
                          disabled={!simReady}
                          className="py-1 px-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg text-[9px] font-extrabold transition flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Send size={10} />
                          Send (SIM)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center flex-1">
                <CheckCircle2 size={40} className="text-blue-500/40 mb-3" />
                <p className="text-xs font-black text-slate-800">{t.noOverdueMembers}</p>
                <p className="text-[10px] text-slate-400 mt-1">All members are fully paid!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 h-full flex flex-col">
            {smsLogs.length > 0 ? (
              <>
                <div className="shrink-0 flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200 mb-1 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Logged cellular messages: <strong>{smsLogs.length}</strong>
                  </span>
                  <button
                    id="clear-sms-logs-btn"
                    onClick={onClearLogs}
                    className="text-[10px] text-purple-600 hover:text-white flex items-center gap-1 px-2 py-1 bg-purple-50 hover:bg-purple-600 rounded-lg transition border border-purple-200 cursor-pointer"
                  >
                    <Trash2 size={10} />
                    Clear Logs
                  </button>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {smsLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-2 hover:border-slate-300 transition shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900">{log.memberName}</span>
                          <span className="text-slate-400 font-mono text-[9px]">{log.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[8px] font-bold">
                          <span className={`px-1.5 py-0.5 rounded-md ${
                            log.type === 'reminder'
                              ? 'bg-purple-50 text-purple-700 border border-purple-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {log.type === 'reminder' ? t.smsReminder : t.smsReceipt}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded-md ${
                            log.status === 'sent'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {log.status === 'sent' ? t.smsStatusSent : t.smsStatusDraft}
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-200 shadow-inner">
                        {log.message}
                      </p>

                      <div className="flex justify-between items-center text-[8px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-200">
                        <span>SIM Log ID: #{log.id.slice(0, 8)}</span>
                        <span>{new Date(log.sentAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center flex-1">
                <History size={40} className="text-slate-300 mb-3" />
                <p className="text-xs font-bold text-slate-500">{t.noPayments}</p>
                <p className="text-[10px] text-slate-400 mt-1">Dispatched messages will show up here.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer code explanation snippet */}
      <div className="mt-4 pt-3 border-t border-slate-100 shrink-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 shadow-inner">
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1 font-bold">
          <Wifi size={10} className="text-purple-600" /> Android SMS API Signature
        </p>
        <code className="block text-[8px] text-purple-600 font-mono overflow-x-auto whitespace-pre font-bold leading-normal">
{`SmsManager smsManager = SmsManager.getDefault();
smsManager.sendTextMessage(phone, null, message, null, null);`}
        </code>
      </div>
    </div>
  );
}
