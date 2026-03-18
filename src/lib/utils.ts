import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
    case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'poor': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'failing': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getScoreGrade(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  if (score >= 40) return 'poor';
  return 'failing';
}

export function getComplianceColor(status: string): string {
  switch (status) {
    case 'compliant': return 'text-green-700 bg-green-100';
    case 'partial': return 'text-yellow-700 bg-yellow-100';
    case 'nonCompliant': return 'text-red-700 bg-red-100';
    default: return 'text-gray-700 bg-gray-100';
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
