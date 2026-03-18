'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-hanul-500 to-sovereign-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">{t('app.name')}</span>
          </div>
          <p className="text-sm text-gray-500">{t('app.tagline')}</p>
          <p className="text-xs text-gray-400">&copy; 2026 HanulAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
