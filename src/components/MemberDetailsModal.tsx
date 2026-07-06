/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, DollarSign, Phone, Activity, CreditCard, Send, Edit, MessageSquare, ShieldAlert } from 'lucide-react';
import { Language, Member, PaymentLog } from '../types';
import { translations } from '../translations';
import { formatEthiopianDate } from '../utils/ethiopianDate';

interface MemberDetailsModalProps {
  language: Language;
  member: Member;
  paymentLogs: PaymentLog[];
  onClose: () => void;
  onEdit: () => void;
  onRecordPayment: (memberId: string, amount: number) => void;
  onSendSms: (memberId: string, type: 'reminder' | 'receipt') => void;
  simReady: boolean;
}

export default function MemberDetailsModal({
  language,
  member,
  paymentLogs,
  onClose,
  onEdit,
  onRecordPayment,
  onSendSms,
  simReady,
}: MemberDetailsModalProps) {
  const t = translations[language];
  const [paymentAmount, setPaymentAmount] = useState(member.monthlyFee);

  // Filter payment logs for this specific member
  const memberLogs = paymentLogs.filter((log) => log.memberId === member.id);

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordPayment(member.id, paymentAmount);
  };

  return (
    <div id="member-details-modal-overlay" className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="member-details-modal" 
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 shrink-0 text-slate-900">
          <div className="flex items-center gap-3">
            <span className={`w-3.5 h-3.5 rounded-full ${member.isActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
            <h2 className="text-xl font-display font-black text-slate-900 truncate max-w-[200px] md:max-w-[350px]">
              {member.name}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              member.paymentStatus === 'paid'
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'bg-purple-50 text-purple-700 border border-purple-100'
            }`}>
              {member.paymentStatus === 'paid' ? t.paid : t.overdue}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="details-modal-edit-btn"
              onClick={onEdit}
              className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition cursor-pointer"
              title={t.editMember}
            >
              <Edit size={18} />
            </button>
            <button
              id="details-modal-close-btn"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Stats Grid with Ethiopian Calendar Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.phoneNumber}
              </span>
              <div className="flex items-center gap-1.5 text-slate-800 font-mono text-xs font-semibold">
                <Phone size={12} className="text-slate-400" />
                <a href={`tel:${member.phone}`} className="hover:text-blue-600 underline">{member.phone}</a>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.startingDate}
              </span>
              <div className="flex flex-col gap-0.5 text-slate-800 font-semibold text-xs">
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-slate-400" />
                  <span>{formatEthiopianDate(member.startDate, language)}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono pl-3.5">({member.startDate})</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.monthlyFee}
              </span>
              <div className="flex items-center gap-1.5 text-slate-800 font-mono text-xs font-semibold">
                <DollarSign size={12} className="text-slate-400" />
                <span className="text-blue-600 font-bold">{member.monthlyFee} {t.currency}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.nextPaymentDue}
              </span>
              <div className="flex flex-col gap-0.5 text-xs font-bold">
                <div className="flex items-center gap-1">
                  <Activity size={12} className="text-slate-400" />
                  <span className={member.paymentStatus === 'overdue' ? 'text-purple-600' : 'text-blue-600'}>
                    {formatEthiopianDate(member.nextPaymentDate, language)}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono pl-3.5">({member.nextPaymentDate})</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Payment Recorder Panel */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="font-display font-black text-sm text-slate-900 mb-2 flex items-center gap-2">
                  <CreditCard size={16} className="text-blue-600" />
                  {t.recordPayment}
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Logging a payment extends their &quot;Next Payment Due Date&quot; by exactly 30 days (1 Ethiopian Month) and logs an offline transaction.
                </p>
                
                <form id="record-payment-form" onSubmit={handleRecordPaymentSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono font-bold text-slate-400 block mb-1 uppercase">
                      {t.paymentAmount}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-mono text-xs text-slate-400 font-bold">
                        {t.currency}
                      </span>
                      <input
                        id="payment-amount-input"
                        type="number"
                        min="1"
                        required
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl pl-12 pr-4 py-2 text-slate-900 font-mono text-sm focus:outline-none transition font-semibold"
                      />
                    </div>
                  </div>
                  
                  <button
                    id="record-payment-btn"
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold font-display rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    Confirm &amp; Log Payment
                  </button>
                </form>
              </div>

              {/* SMS Alert drafting inside details */}
              <div className="border-t border-slate-200 mt-5 pt-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                  Local SIM SMS Actions
                </span>
                <div className="flex gap-2">
                  <button
                    id="details-sms-reminder-btn"
                    onClick={() => onSendSms(member.id, 'reminder')}
                    disabled={!simReady}
                    className="flex-1 py-2 px-2.5 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 border border-purple-200 hover:border-purple-600 disabled:border-slate-200 disabled:cursor-not-allowed rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare size={12} />
                    {t.smsReminder}
                  </button>
                  <button
                    id="details-sms-receipt-btn"
                    onClick={() => onSendSms(member.id, 'receipt')}
                    disabled={!simReady || memberLogs.length === 0}
                    className="flex-1 py-2 px-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 border border-blue-200 hover:border-blue-600 disabled:border-slate-200 disabled:cursor-not-allowed rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send size={12} />
                    Receipt (SIM)
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Logs History Panel */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col">
              <h3 className="font-display font-black text-sm text-slate-900 mb-3">
                {t.paymentLogs}
              </h3>

              <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-2">
                {memberLogs.length > 0 ? (
                  memberLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center text-xs shadow-sm text-slate-900"
                    >
                      <div>
                        <span className="font-mono font-black text-blue-600 block">
                          +{log.amount} {t.currency}
                        </span>
                        <div className="text-[9px] text-slate-500 mt-0.5 space-y-0.5">
                          <p>
                            {t.extendedTo}: <strong className="font-semibold text-slate-700">{formatEthiopianDate(log.dueDateExtendedTo, language)}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block font-mono">
                          {formatEthiopianDate(log.paymentDate, language)}
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono">({log.paymentDate.split('T')[0]})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
                    <ShieldAlert size={24} className="opacity-40 mb-2" />
                    <p className="text-xs font-semibold">{t.noPayments}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
