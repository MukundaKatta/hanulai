'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SUPPORTED_LANGUAGES } from '@/types';
import { getSearchResults } from '@/lib/mock-data';
import type { SearchResult, SearchQuery } from '@/types';

export default function SearchDemoPage() {
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('ko');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [analysis, setAnalysis] = useState<{ intent: string; language: string; entities: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const placeholders: Record<string, string> = {
    ko: '한국의 전통 음식에 대해 알려주세요',
    ja: '日本の伝統文化について教えてください',
    hi: 'भारतीय संस्कृति के बारे में बताइए',
    ar: 'أخبرني عن الثقافة العربية',
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const data = getSearchResults(query, language);
      setResults(data.results);
      setAnalysis(data.analysis);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('search.title')}</h1>
        <p className="text-gray-500 mt-1">{t('search.subtitle')}</p>
      </div>

      {/* Search bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Select
                options={SUPPORTED_LANGUAGES.filter(l => ['ko', 'ja', 'hi', 'ar'].includes(l.code)).map((l) => ({
                  value: l.code,
                  label: l.nativeName,
                }))}
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setQuery('');
                }}
                className="w-40"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={placeholders[language] || t('search.placeholder')}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-hanul-500 focus:ring-2 focus:ring-hanul-200 text-sm outline-none transition-all"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-hanul-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <Button onClick={handleSearch} disabled={loading || !query.trim()}>
                {loading ? t('common.loading') : t('search.search')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          {/* Query analysis */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t('search.queryAnalysis')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('search.intent')}</p>
                  <Badge variant="info">{analysis.intent}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('search.language')}</p>
                  <Badge variant="default">
                    {SUPPORTED_LANGUAGES.find(l => l.code === analysis.language)?.nativeName || analysis.language}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('search.entities')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.entities.map((entity, i) => (
                      <Badge key={i} variant="sovereign">{entity}</Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">LLM Processing Pipeline</p>
                  <div className="space-y-2">
                    {['Query Understanding', 'Language Detection', 'Entity Extraction', 'Intent Classification', 'Snippet Generation', 'Relevance Ranking'].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-600">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search results */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-medium text-gray-500">{t('search.results')} ({results.length})</h3>
            {results.map((result) => (
              <Card key={result.id} hover>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <a href={result.url} className="text-lg font-medium text-hanul-600 hover:text-hanul-700 hover:underline">
                        {result.title}
                      </a>
                      <p className="text-xs text-green-700 mt-0.5">{result.url}</p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">{t('search.snippet')}</p>
                        <p className="text-sm text-gray-600 leading-relaxed" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                          {result.snippet}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant="default">{result.source}</Badge>
                        <span className="text-xs text-gray-400">
                          {t('search.relevance')}: {(result.relevanceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
