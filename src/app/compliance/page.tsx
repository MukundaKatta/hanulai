'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AVAILABLE_MODELS } from '@/types';
import { generateComplianceResult } from '@/lib/mock-data';
import { getComplianceColor } from '@/lib/utils';
import type { ComplianceResult } from '@/types';

const countries = [
  { value: 'KR', label: 'South Korea (KR)' },
  { value: 'JP', label: 'Japan (JP)' },
  { value: 'IN', label: 'India (IN)' },
];

export default function CompliancePage() {
  const t = useTranslations();
  const [country, setCountry] = useState('');
  const [model, setModel] = useState('');
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!country || !model) return;
    setLoading(true);
    setTimeout(() => {
      setResult(generateComplianceResult(country, model));
      setLoading(false);
    }, 1200);
  };

  const statusIcon = (status: string) => {
    if (status === 'compliant') return (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
    if (status === 'partial') return (
      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    );
    if (status === 'nonCompliant') return (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
    return (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('compliance.title')}</h1>
        <p className="text-gray-500 mt-1">{t('compliance.subtitle')}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select
              label={t('compliance.selectCountry')}
              options={[{ value: '', label: t('common.selectOption') }, ...countries]}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <Select
              label={t('compliance.selectModel')}
              options={[
                { value: '', label: t('common.selectOption') },
                ...AVAILABLE_MODELS.map(m => ({ value: m.id, label: m.name })),
              ]}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <Button onClick={handleCheck} disabled={!country || !model || loading} size="lg">
              {loading ? t('common.loading') : t('compliance.runCheck')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Overall status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${
                  result.overallStatus === 'compliant' ? 'bg-green-100' :
                  result.overallStatus === 'partial' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {result.overallStatus === 'compliant' ? (
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ) : result.overallStatus === 'partial' ? (
                    <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  ) : (
                    <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {t('compliance.report')}: {AVAILABLE_MODELS.find(m => m.id === result.modelId)?.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {countries.find(c => c.value === result.country)?.label}
                  </p>
                  <Badge
                    variant={result.overallStatus === 'compliant' ? 'success' : result.overallStatus === 'partial' ? 'warning' : 'danger'}
                    className="mt-2 text-base px-4 py-1"
                  >
                    {t(`compliance.status.${result.overallStatus}`)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.categories.map((cat) => (
              <Card key={cat.id} className={`border-l-4 ${
                cat.status === 'compliant' ? 'border-l-green-500' :
                cat.status === 'partial' ? 'border-l-yellow-500' : 'border-l-red-500'
              }`}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {statusIcon(cat.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {t(`compliance.categories.${cat.id}`)}
                        </h4>
                        <Badge
                          variant={cat.status === 'compliant' ? 'success' : cat.status === 'partial' ? 'warning' : 'danger'}
                        >
                          {t(`compliance.status.${cat.status}`)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{cat.details}</p>
                      <div className="mt-3 space-y-1">
                        {cat.requirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            <span className="text-xs text-gray-500">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>{t('compliance.recommendation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-hanul-100 text-hanul-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
