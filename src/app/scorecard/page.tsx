'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AVAILABLE_MODELS, SUPPORTED_LANGUAGES } from '@/types';
import { generateScorecardResult } from '@/lib/mock-data';
import { getGradeColor, getScoreGrade } from '@/lib/utils';
import type { ScorecardResult } from '@/types';

export default function ScorecardPage() {
  const t = useTranslations();
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = () => {
    if (!selectedModel || !selectedLanguage) return;
    setLoading(true);
    setTimeout(() => {
      setResult(generateScorecardResult(selectedModel, selectedLanguage));
      setLoading(false);
    }, 1500);
  };

  const dimensionLabels: Record<string, string> = {
    fluency: t('scorecard.dimensions.fluency'),
    grammar: t('scorecard.dimensions.grammar'),
    vocabulary: t('scorecard.dimensions.vocabulary'),
    cultural: t('scorecard.dimensions.cultural'),
    idioms: t('scorecard.dimensions.idioms'),
    formality: t('scorecard.dimensions.formality'),
    technical: t('scorecard.dimensions.technical'),
    creative: t('scorecard.dimensions.creative'),
    reasoning: t('scorecard.dimensions.reasoning'),
    safety: t('scorecard.dimensions.safety'),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('scorecard.title')}</h1>
        <p className="text-gray-500 mt-1">{t('scorecard.subtitle')}</p>
      </div>

      {/* Config panel */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select
              label={t('scorecard.selectModel')}
              options={[
                { value: '', label: t('common.selectOption') },
                ...AVAILABLE_MODELS.map((m) => ({ value: m.id, label: `${m.name} (${m.provider})` })),
              ]}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            />
            <Select
              label={t('scorecard.selectLanguage')}
              options={[
                { value: '', label: t('common.selectOption') },
                ...SUPPORTED_LANGUAGES.map((l) => ({ value: l.code, label: `${l.nativeName} (${l.name})` })),
              ]}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            />
            <Button onClick={handleRun} disabled={!selectedModel || !selectedLanguage || loading} size="lg">
              {loading ? t('common.loading') : t('scorecard.runEvaluation')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Overall score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke={result.overallScore >= 80 ? '#22c55e' : result.overallScore >= 60 ? '#3b82f6' : '#f59e0b'}
                        strokeWidth="10"
                        strokeDasharray={`${(result.overallScore / 100) * 314} 314`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">{result.overallScore}</span>
                      <span className="text-sm text-gray-500">{t('scorecard.overall')}</span>
                    </div>
                  </div>
                  <Badge
                    variant={result.overallScore >= 80 ? 'success' : result.overallScore >= 60 ? 'info' : 'warning'}
                    className="mt-2 text-base px-4 py-1"
                  >
                    {result.overallGrade}
                  </Badge>
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {AVAILABLE_MODELS.find(m => m.id === result.modelId)?.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {SUPPORTED_LANGUAGES.find(l => l.code === result.language)?.nativeName} ({SUPPORTED_LANGUAGES.find(l => l.code === result.language)?.name})
                  </p>

                  {/* Radar-like bar display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.dimensions.map((dim) => (
                      <div key={dim.key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">{dimensionLabels[dim.key] || dim.key}</span>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getGradeColor(dim.grade)}`}>
                            {dim.score}
                          </span>
                        </div>
                        <Progress
                          value={dim.score}
                          size="sm"
                          color={dim.score >= 85 ? 'green' : dim.score >= 70 ? 'blue' : dim.score >= 55 ? 'yellow' : 'red'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dimension detail cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {result.dimensions.map((dim) => (
              <Card key={dim.key} className={`border-l-4 ${
                dim.score >= 85 ? 'border-l-green-500' :
                dim.score >= 70 ? 'border-l-blue-500' :
                dim.score >= 55 ? 'border-l-yellow-500' : 'border-l-red-500'
              }`}>
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-gray-500 mb-1">{dimensionLabels[dim.key] || dim.key}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{dim.score}</span>
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                  <Badge
                    variant={dim.grade === 'excellent' ? 'success' : dim.grade === 'good' ? 'info' : dim.grade === 'fair' ? 'warning' : 'danger'}
                    className="mt-2"
                  >
                    {t(`scorecard.grades.${dim.grade}`)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
