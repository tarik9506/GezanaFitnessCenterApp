/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-ignore
import { toEthiopian, toGregorian } from 'ethiopian-date';
import { Language } from '../types';

export const ETHIOPIAN_MONTHS: Record<Language, string[]> = {
  EN: [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yakatit',
    'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagumen'
  ],
  AM: [
    'መስከረም', 'ጥቅምት', 'ህዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
  ],
  TI: [
    'መስከረም', 'ጥቅምቲ', 'ሕዳር', 'ታሕሳስ', 'ጥሪ', 'ለካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰነ', 'ሓምለ', 'ነሓሰ', 'ጳጉሜ'
  ]
};

/**
 * Converts a Gregorian ISO Date string (YYYY-MM-DD) to an Ethiopian Date object
 */
export function getEthiopianDate(gregorianDateStr: string): { year: number; month: number; day: number } {
  try {
    if (!gregorianDateStr) {
      const today = new Date();
      const eth = toEthiopian(today.getFullYear(), today.getMonth() + 1, today.getDate());
      return { year: eth[0], month: eth[1], day: eth[2] };
    }
    const parts = gregorianDateStr.split('T')[0].split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    const eth = toEthiopian(year, month, day);
    return { year: eth[0], month: eth[1], day: eth[2] };
  } catch (error) {
    const today = new Date();
    const eth = toEthiopian(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return { year: eth[0], month: eth[1], day: eth[2] };
  }
}

/**
 * Converts an Ethiopian Date (year, month, day) to a Gregorian Date string (YYYY-MM-DD)
 */
export function getGregorianDateStr(year: number, month: number, day: number): string {
  try {
    const gc = toGregorian(year, month, day);
    const yStr = String(gc[0]).padStart(4, '0');
    const mStr = String(gc[1]).padStart(2, '0');
    const dStr = String(gc[2]).padStart(2, '0');
    return `${yStr}-${mStr}-${dStr}`;
  } catch (error) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}

/**
 * Formats an Ethiopian Date beautifully for display in the current language
 */
export function formatEthiopianDate(gregorianDateStr: string, lang: Language): string {
  const { year, month, day } = getEthiopianDate(gregorianDateStr);
  const months = ETHIOPIAN_MONTHS[lang] || ETHIOPIAN_MONTHS['EN'];
  const monthName = months[month - 1] || months[0];
  
  if (lang === 'EN') {
    return `${monthName} ${day}, ${year} (EC)`;
  } else {
    return `${monthName} ${day} ቀን ${year} (ዓ.ም)`;
  }
}

/**
 * Adds exactly 1 Ethiopian month (30 days) to a Gregorian date string
 */
export function addEthiopianMonth(gregorianDateStr: string): string {
  try {
    const date = new Date(gregorianDateStr);
    if (isNaN(date.getTime())) {
      const today = new Date();
      today.setDate(today.getDate() + 30);
      return today.toISOString().split('T')[0];
    }
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  } catch (error) {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    return today.toISOString().split('T')[0];
  }
}
