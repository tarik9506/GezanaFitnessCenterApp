/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Key, RefreshCw, Copy, Check, Info } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface DrmManagerProps {
  language: Language;
  authorizedId: string;
  currentId: string;
  onUpdateIds: (authorized: string, current: string) => void;
  isUnlocked: boolean;
}

export default function DrmManager({
  language,
  authorizedId,
  currentId,
  onUpdateIds,
  isUnlocked
}: DrmManagerProps) {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [customAuthId, setCustomAuthId] = useState(authorizedId);

  useEffect(() => {
    setCustomAuthId(authorizedId);
  }, [authorizedId]);

  const generateRandomAndroidId = () => {
    const chars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    onUpdateIds(authorizedId, result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAuthorizeCurrent = () => {
    onUpdateIds(currentId, currentId);
  };

  const handleSimulateMismatch = () => {
    const mismatchId = 'A1B2C3D4E5F67890';
    onUpdateIds(mismatchId, currentId);
  };

  return (
    <div id="drm-manager-panel" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isUnlocked ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
            {isUnlocked ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
          </div>
          <div>
            <h3 className="font-display font-black text-base text-slate-900 leading-tight">
              {t.drmStatus}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Settings.Secure.ANDROID_ID Licensing
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold ${
          isUnlocked 
            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
            : 'bg-purple-50 text-purple-700 border border-purple-100'
        }`}>
          {isUnlocked ? t.drmUnlocked : t.drmLocked}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-5 leading-relaxed font-medium">
        {language === 'EN' && "This offline-only DRM security binds the gym database to this single physical smartphone, preventing unauthorized distribution of the APK file to other gyms via Bluetooth, Xender, or SD Card."}
        {language === 'AM' && "ይህ ከመስመር ውጭ ብቻ የሚሰራ የDRM ጥበቃ የጂም መረጃውን ከአንድ የተወሰነ ስልክ ጋር ያገናኛል። ይህም አፕሊኬሽኑን በብሉቱዝ፣ በXender ወይም በኤስዲ ካርድ ለሌሎች ሰዎች አሳልፎ እንዳይሰጥ ይከላከላል።"}
        {language === 'TI' && "እዚ ካብ ኢንተርኔት ወጻኢ ጥራይ ዝሰርሕ ናይ DRM ዕቝባ፡ ነቲ ናይ ጂም ሓበሬታ ምስ ሓደ ፍሉይ ስልኪ የራኽቦ። እዚ ድማ ነቲ ኣፕሊኬሽን ብብሉቱዝ፣ ብXender ወይ ብኤስዲ ካርድ ናብ ካልኦት ሰባት ከይመሓላለፍ ይከላኸል።"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Current Android ID card */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{t.currentAndroidId}</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-mono font-black text-blue-600 tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                {currentId}
              </span>
              <button 
                id="copy-android-id-btn"
                onClick={handleCopy} 
                className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition cursor-pointer"
                title="Copy ID"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          
          <button
            id="regenerate-android-id-btn"
            onClick={generateRandomAndroidId}
            className="mt-4 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <RefreshCw size={12} />
            Device Swapping Simulation
          </button>
        </div>

        {/* Authorized Android ID config */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{t.authorizedAndroidId}</span>
            <div className="mt-2">
              <input
                id="authorized-id-input"
                type="text"
                value={customAuthId}
                onChange={(e) => {
                  setCustomAuthId(e.target.value.toUpperCase());
                  onUpdateIds(e.target.value.toUpperCase(), currentId);
                }}
                className="w-full bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-800 font-bold uppercase tracking-widest focus:outline-none shadow-inner"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              id="authorize-device-btn"
              onClick={handleAuthorizeCurrent}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-sm"
            >
              <Key size={12} />
              {t.registerDevice}
            </button>
            <button
              id="simulate-mismatch-btn"
              onClick={handleSimulateMismatch}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white text-xs font-extrabold rounded-xl transition border border-purple-200 hover:border-purple-600 cursor-pointer"
            >
              <ShieldAlert size={12} />
              {t.resetDrm}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3 shadow-inner">
        <Info size={18} className="text-slate-400 shrink-0 mt-0.5" />
        <div className="text-[10px] text-slate-500 space-y-1 w-full overflow-hidden">
          <p className="font-bold text-slate-800">Developer Notes & Integration Code:</p>
          <p>This mimics Android&apos;s hardware ID check in Java/Kotlin code:</p>
          <code className="block bg-slate-900 p-2.5 rounded-xl mt-1 text-blue-400 overflow-x-auto whitespace-pre font-mono font-bold leading-relaxed">
{`String androidId = Settings.Secure.getString(
    context.getContentResolver(), 
    Settings.Secure.ANDROID_ID
);
if (!androidId.equals(AUTHORIZED_LICENSE_KEY)) {
    showUnauthorizedDeviceScreen();
}`}
          </code>
        </div>
      </div>
    </div>
  );
}
