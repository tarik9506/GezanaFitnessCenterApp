/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Dumbbell, Globe, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { motion } from 'motion/react';
import muscularBoyImage from '../assets/images/muscular_boy_gym_workout_1783367271948.jpg';

interface SplashScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onEnter: () => void;
}

export default function SplashScreen({
  language,
  onLanguageChange,
  onEnter,
}: SplashScreenProps) {
  const t = translations[language];

  return (
    <div id="splash-screen" className="relative w-full h-screen overflow-hidden bg-slate-50 flex items-center justify-start">
      {/* Background athlete image with no-referrer policy */}
      <img
        src={muscularBoyImage}
        alt="Gezana Gym Athlete"
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
        referrerPolicy="no-referrer"
      />

      {/* Light vignette overlay to guarantee 100% text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/50 md:bg-gradient-to-r md:from-white md:via-white/95 md:to-transparent" />

      {/* Content Area */}
      <div className="relative z-10 w-full max-w-xl px-6 md:px-12 py-8 flex flex-col justify-between h-full text-slate-900">
        
        {/* Top Header Row */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/10 text-blue-600 rounded-xl border border-blue-600/20">
            <Dumbbell size={20} className="rotate-[-15deg]" />
          </div>
          <div>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Offline APK v1.0.4
            </span>
          </div>
        </div>

        {/* Center Card with login features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-6 md:space-y-8 my-auto"
        >
          {/* Logo / Ge'ez Header */}
          <div className="space-y-2">
            <span className="text-sm font-mono text-purple-600 font-bold uppercase tracking-widest block">
              Gezana Fitness Center
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
              ገዛና ፊትነስ ሴንተር
            </h1>
            <p className="text-sm text-slate-500 max-w-md font-medium">
              {language === 'EN' && "Professional offline-first gym member directory, subscription scheduler, and automatic Ethio Telecom SMS reminder dispatcher."}
              {language === 'AM' && "ማንም ሰው መረጃዎን ሳያይ ከኢንተርኔት ውጭ የሚሰራ የጂም አባላት መቆጣጠሪያ፣ የወርሃዊ ክፍያ ማስሊያ እና አውቶማቲክ የኤስኤምኤስ መላኪያ።"}
              {language === 'TI' && "ካብ ኢንተርኔት ወጻኢ ዝሰርሕ ናይ ጂም ኣባላት መቆጻጸሪ፣ ናይ ወርሓዊ ክፍሊት መምዘንን ናይ መተሓሳሰቢ ኤስኤምኤስ መለኣኽን።"}
            </p>
          </div>

          {/* Language Selection bar */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={14} className="text-purple-600" />
              {t.language} / ቋንቋ
            </label>
            <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex items-center max-w-xs shadow-inner">
              <button
                id="splash-lang-en"
                type="button"
                onClick={() => onLanguageChange('EN')}
                className={`flex-1 py-2 text-xs font-bold font-display rounded-lg transition ${
                  language === 'EN'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                English
              </button>
              <button
                id="splash-lang-am"
                type="button"
                onClick={() => onLanguageChange('AM')}
                className={`flex-1 py-2 text-xs font-bold font-display rounded-lg transition ${
                  language === 'AM'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                አማርኛ
              </button>
              <button
                id="splash-lang-ti"
                type="button"
                onClick={() => onLanguageChange('TI')}
                className={`flex-1 py-2 text-xs font-bold font-display rounded-lg transition ${
                  language === 'TI'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                ትግርኛ
              </button>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              id="splash-enter-btn"
              type="button"
              onClick={onEnter}
              className="w-full max-w-xs py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold font-display rounded-xl transition text-base shadow-lg hover:shadow-purple-200/50 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <ShieldCheck size={20} className="group-hover:scale-110 transition" />
              <span>
                {language === 'EN' && "Unlock & Enter Gym"}
                {language === 'AM' && "ጂሙን ክፈት እና ግባ"}
                {language === 'TI' && "ጂም ኽፈት እሞ እቶ"}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Bottom Security Trust row */}
        <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-slate-400 font-mono font-bold uppercase">
          <span className="flex items-center gap-1">
            <Lock size={12} className="text-emerald-600 shrink-0" />
            SQLite Encrypted
          </span>
          <span className="flex items-center gap-1">
            🛡️ Room Offline DB
          </span>
          <span className="flex items-center gap-1">
            📲 cellular SMS Ready
          </span>
        </div>

      </div>
    </div>
  );
}
