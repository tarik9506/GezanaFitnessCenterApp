/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Phone, Calendar, DollarSign, ArrowLeft, Save, Sparkles } from 'lucide-react';
import { Language, Member } from '../types';
import { translations } from '../translations';
import { formatEthiopianDate, addEthiopianMonth } from '../utils/ethiopianDate';

interface MemberFormProps {
  language: Language;
  member?: Member | null; // If null, we are adding a new member
  onSave: (memberData: Omit<Member, 'id' | 'createdAt'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function MemberForm({
  language,
  member,
  onSave,
  onCancel,
}: MemberFormProps) {
  const t = translations[language];

  // States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [monthlyFee, setMonthlyFee] = useState<number>(300); // Standard local fee in Ethiopia (Birr)
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'overdue'>('paid');
  const [isActive, setIsActive] = useState(true);

  // Auto-fill states if editing
  useEffect(() => {
    if (member) {
      setName(member.name);
      setPhone(member.phone);
      setStartDate(member.startDate);
      setMonthlyFee(member.monthlyFee);
      setPaymentStatus(member.paymentStatus);
      setIsActive(member.isActive);
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    // Calculate next payment due date based on starting date and status
    // If 'paid', next payment is startDate + 30 days (exactly 1 Ethiopian month)
    let nextPaymentDate = startDate;
    if (paymentStatus === 'paid') {
      nextPaymentDate = addEthiopianMonth(startDate);
    }

    onSave({
      id: member?.id,
      name: name.trim(),
      phone: phone.trim(),
      startDate,
      monthlyFee,
      paymentStatus,
      nextPaymentDate,
      isActive,
    });
  };

  return (
    <form id="member-form" onSubmit={handleSubmit} className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            id="member-form-back-btn"
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-display font-black text-slate-900">
            {member ? t.editMember : t.addMember}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="member-name" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
            {t.fullName} *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User size={18} />
            </div>
            <input
              id="member-name"
              type="text"
              required
              placeholder={t.newMemberPlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none transition text-base font-semibold"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="member-phone" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
            {t.phoneNumber} *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone size={18} />
            </div>
            <input
              id="member-phone"
              type="tel"
              required
              placeholder={t.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none transition text-base font-semibold"
            />
          </div>
        </div>

        {/* Starting Date & Ethiopian conversion live sync */}
        <div className="space-y-2">
          <label htmlFor="member-start-date" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
            {t.startingDate}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar size={18} />
            </div>
            <input
              id="member-start-date"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl pl-11 pr-4 py-3 text-slate-900 focus:outline-none transition text-base font-semibold font-mono"
            />
          </div>

          {/* Ethiopian Calendar Live Translation Indicator */}
          <div className="mt-2 flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm">
            <span className="font-mono text-[10px] bg-blue-600 text-white px-1 py-0.5 rounded uppercase">EC</span>
            <span>{formatEthiopianDate(startDate, language)}</span>
          </div>
        </div>

        {/* Monthly Fee */}
        <div className="space-y-2">
          <label htmlFor="member-monthly-fee" className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
            {t.monthlyFee}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <DollarSign size={18} />
            </div>
            <input
              id="member-monthly-fee"
              type="number"
              min="0"
              required
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl pl-11 pr-4 py-3 text-slate-900 focus:outline-none transition text-base font-semibold font-mono"
            />
          </div>
        </div>

        {/* Initial Payment Status (Only when adding) */}
        {!member && (
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
              {t.selectPaymentStatus}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="select-status-paid"
                type="button"
                onClick={() => setPaymentStatus('paid')}
                className={`py-3 px-4 rounded-xl font-bold font-display text-sm transition border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  paymentStatus === 'paid'
                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span className="text-base font-bold">🟢 {t.paid}</span>
                <span className="text-[10px] opacity-75">Next pay in exactly 1 EC month</span>
              </button>
              <button
                id="select-status-overdue"
                type="button"
                onClick={() => setPaymentStatus('overdue')}
                className={`py-3 px-4 rounded-xl font-bold font-display text-sm transition border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  paymentStatus === 'overdue'
                    ? 'bg-purple-50 border-purple-600 text-purple-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span className="text-base font-bold">🔴 {t.overdue}</span>
                <span className="text-[10px] opacity-75">Mark overdue instantly</span>
              </button>
            </div>
          </div>
        )}

        {/* Membership Activation Status (Only when editing) */}
        {member && (
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
              {t.toggleActive}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="toggle-active-true"
                type="button"
                onClick={() => setIsActive(true)}
                className={`py-3 px-4 rounded-xl font-bold font-display text-sm transition border flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>🟢</span> {t.statusActive}
              </button>
              <button
                id="toggle-active-false"
                type="button"
                onClick={() => setIsActive(false)}
                className={`py-3 px-4 rounded-xl font-bold font-display text-sm transition border flex items-center justify-center gap-2 cursor-pointer ${
                  !isActive
                    ? 'bg-purple-50 border-purple-600 text-purple-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>⚫</span> {t.statusInactive}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <button
          id="member-form-cancel-btn"
          type="button"
          onClick={onCancel}
          className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-display rounded-xl transition text-base text-center cursor-pointer"
        >
          {t.cancel}
        </button>
        <button
          id="member-form-save-btn"
          type="submit"
          className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold font-display rounded-xl transition text-base shadow-lg hover:shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save size={18} />
          {t.save}
        </button>
      </div>

      {/* Info Badge */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-start gap-3 mt-4">
        <Sparkles size={16} className="text-purple-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-500 leading-relaxed space-y-1">
          <p className="font-bold text-slate-800">Offline SQLite Extractor Mechanism</p>
          <p>
            This registers a user locally on SQLite/Room database. Saving creates a new row with automatic schema indexing. Next Payment Due Date will calculate to <strong>{paymentStatus === 'paid' ? '30 days from start date' : 'immediately'}</strong>.
          </p>
        </div>
      </div>
    </form>
  );
}
