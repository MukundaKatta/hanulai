'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs } from '@/components/ui/tabs';
import { SUPPORTED_LANGUAGES } from '@/types';
import { generateBilingualResults } from '@/lib/mock-data';
import type { BilingualResult } from '@/types';

export default function BilingualPage() {
  const t = useTranslations();
  const [sourceLang, setSourceLang] = useState('ko');
  const [targetLang, setTargetLang] = useState('en');
  const [results, setResults] = useState<BilingualResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState('translation');

  const handleRun = () => {
    setLoading(true);
    setTimeout(() => {
      setResults(generateBilingualResults(sourceLang, targetLang, activeTest));
      setLoading(false);
    }, 1000);
  };

  const testTypes = [
    { id: 'translation', label: t('bilingual.testTypes.translation') },
    { id: 'codeSwitch', label: t('bilingual.testTypes.codeSwitch') },
    { id: 'mixed', label: t('bilingual.testTypes.mixed') },
    { id: 'cultural', label: t('bilingual.testTypes.cultural') },
  ];

  const langOptions = [
    ...SUPPORTED_LANGUAGES.filter(l => ['ko', 'ja', 'hi'].includes(l.code)).map(l => ({
      value: l.code, label: `${l.nativeName} (${l.name})`,
    })),
    { value: 'en', label: 'English' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('bilingual.title')}</h1>
        <p className="text-gray-500 mt-1">{t('bilingual.subtitle')}</p>
      </div>

      {/* Config */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <Select
              label={t('bilingual.sourceLang')}
              options={langOptions}
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            />
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <Select
              label={t('bilingual.targetLang')}
              options={langOptions}
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            />
            <Button onClick={handleRun} disabled={loading || sourceLang === targetLang} size="lg">
              {loading ? t('common.loading') : t('bilingual.run')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test type tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {testTypes.map((tt) => (
          <button
            key={tt.id}
            onClick={() => { setActiveTest(tt.id); setResults([]); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTest === tt.id
                ? 'bg-hanul-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tt.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6 animate-slide-up">
          {/* Metrics summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-sm text-gray-500">{t('bilingual.metrics.bleu')}</p>
                <p className="text-3xl font-bold text-hanul-600 mt-1">
                  {(results.reduce((a, r) => a + r.metrics.bleu, 0) / results.length).toFixed(3)}
                </p>
                <Progress
                  value={(results.reduce((a, r) => a + r.metrics.bleu, 0) / results.length) * 100}
                  size="sm"
                  color="blue"
                  className="mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-sm text-gray-500">{t('bilingual.metrics.comet')}</p>
                <p className="text-3xl font-bold text-sovereign-600 mt-1">
                  {(results.reduce((a, r) => a + r.metrics.comet, 0) / results.length).toFixed(3)}
                </p>
                <Progress
                  value={(results.reduce((a, r) => a + r.metrics.comet, 0) / results.length) * 100}
                  size="sm"
                  color="purple"
                  className="mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-sm text-gray-500">{t('bilingual.metrics.human')}</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {(results.reduce((a, r) => a + r.metrics.humanScore, 0) / results.length).toFixed(1)}
                  <span className="text-sm text-gray-400 font-normal">/5</span>
                </p>
                <Progress
                  value={(results.reduce((a, r) => a + r.metrics.humanScore, 0) / results.length) * 20}
                  size="sm"
                  color="green"
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Individual results */}
          {results.map((result, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="info">{t('bilingual.input')}</Badge>
                      <span className="text-xs text-gray-400">
                        {SUPPORTED_LANGUAGES.find(l => l.code === result.sourceLang)?.nativeName || result.sourceLang}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-800 leading-relaxed">{result.input}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="sovereign">{t('bilingual.output')}</Badge>
                      <span className="text-xs text-gray-400">
                        {SUPPORTED_LANGUAGES.find(l => l.code === result.targetLang)?.nativeName || result.targetLang}
                      </span>
                    </div>
                    <div className="p-4 bg-sovereign-50 rounded-lg">
                      <p className="text-sm text-gray-800 leading-relaxed">{result.output}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">BLEU: <strong>{result.metrics.bleu.toFixed(3)}</strong></span>
                  <span className="text-xs text-gray-500">COMET: <strong>{result.metrics.comet.toFixed(3)}</strong></span>
                  <span className="text-xs text-gray-500">Human: <strong>{result.metrics.humanScore.toFixed(1)}/5</strong></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
