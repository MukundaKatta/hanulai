'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AVAILABLE_MODELS, SUPPORTED_LANGUAGES } from '@/types';
import { generateEvaluationResult } from '@/lib/mock-data';
import type { EvaluationResult } from '@/types';

export default function EvaluationPage() {
  const t = useTranslations();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = () => {
    if (!selectedLanguage || !selectedModel) return;
    setLoading(true);
    setTimeout(() => {
      setResult(generateEvaluationResult(selectedLanguage, selectedModel));
      setLoading(false);
    }, 1200);
  };

  const categoryLabels: Record<string, string> = {
    history: t('evaluation.history'),
    literature: t('evaluation.literature'),
    customs: t('evaluation.customs'),
    cuisine: t('evaluation.cuisine'),
    geography: t('evaluation.geography'),
    politics: t('evaluation.politics'),
    religion: t('evaluation.religion'),
    media: t('evaluation.media'),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('evaluation.title')}</h1>
        <p className="text-gray-500 mt-1">{t('evaluation.subtitle')}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select
              label={t('evaluation.selectLanguage')}
              options={[
                { value: '', label: t('common.selectOption') },
                ...SUPPORTED_LANGUAGES.filter(l => ['ko', 'ja', 'hi', 'ar'].includes(l.code)).map((l) => ({ value: l.code, label: `${l.nativeName} (${l.name})` })),
              ]}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            />
            <Select
              label={t('scorecard.selectModel')}
              options={[
                { value: '', label: t('common.selectOption') },
                ...AVAILABLE_MODELS.map((m) => ({ value: m.id, label: m.name })),
              ]}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            />
            <Button onClick={handleRun} disabled={!selectedLanguage || !selectedModel || loading} size="lg">
              {loading ? t('common.loading') : t('evaluation.runBenchmark')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Overall summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('evaluation.results')}</CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant="info" className="text-base px-4 py-1">
                    {t('evaluation.score')}: {result.overallScore}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.categories.map((cat) => (
                  <Card key={cat.id} className="border shadow-none">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">{categoryLabels[cat.id] || cat.name}</h4>
                        <span className={`text-lg font-bold ${cat.score >= 80 ? 'text-green-600' : cat.score >= 60 ? 'text-blue-600' : 'text-yellow-600'}`}>
                          {cat.score}%
                        </span>
                      </div>
                      <Progress
                        value={cat.score}
                        size="sm"
                        color={cat.score >= 80 ? 'green' : cat.score >= 60 ? 'blue' : 'yellow'}
                        className="mb-3"
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600">
                          {t('evaluation.passed')}: {cat.passed}
                        </span>
                        <span className="text-red-500">
                          {t('evaluation.failed')}: {cat.failed}
                        </span>
                        <span className="text-gray-400">
                          {t('evaluation.total')}: {cat.questions}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bar chart-like visualization */}
          <Card>
            <CardHeader>
              <CardTitle>{t('evaluation.categories')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-48 shrink-0">{categoryLabels[cat.id] || cat.name}</span>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                        <div
                          className={`h-full rounded-lg transition-all duration-700 ${
                            cat.score >= 80 ? 'bg-green-500' : cat.score >= 60 ? 'bg-hanul-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${cat.score}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                          {cat.passed}/{cat.questions} {t('evaluation.passed')}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12 text-right">{cat.score}%</span>
                    </div>
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
