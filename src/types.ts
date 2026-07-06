/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'EN' | 'AM' | 'TI';

export interface Member {
  id: string;
  name: string;
  phone: string;
  startDate: string; // ISO format (YYYY-MM-DD)
  monthlyFee: number;
  paymentStatus: 'paid' | 'overdue';
  nextPaymentDate: string; // ISO format (YYYY-MM-DD)
  isActive: boolean;
  createdAt: string; // ISO format string
}

export interface PaymentLog {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentDate: string; // ISO format
  dueDateExtendedTo: string; // ISO format
}

export interface SmsLog {
  id: string;
  memberId: string;
  memberName: string;
  phoneNumber: string;
  message: string;
  sentAt: string; // ISO format
  type: 'reminder' | 'receipt';
  status: 'sent' | 'failed' | 'draft';
}

export interface DRMConfig {
  authorizedAndroidId: string;
  currentDeviceAndroidId: string;
  isUnlocked: boolean;
}
