'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SUPPORTED_LANGUAGES } from '@/types';
import { generateModelComparisons } from '@/lib/mock-data';
import type { ModelComparison } from '@/types';

const tasks = [
  { value: 'qa', labelKey: 'tasks.qa' },
  { value: 'summarization', labelKey: 'tasks.summarization' },
  { value: 'translation', labelKey: 'tasks.translation' },
  { value: 'sentiment', labelKey: 'tasks.sentiment' },
  { value: 'ner', labelKey: 'tasks.ner' },
  { value: 'generation', labelKey: 'tasks.generation' },
];

export default function ComparePage() {
  const t = useTranslations();
  const [task, setTask] = useState('qa');
  const [language, setLanguage] = useState('ko');
  const [comparisons, setComparisons] = useState<ModelComparison[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCompare = () => {
    setLoading(true);
    setTimeout(() => {
      setComparisons(generateModelComparisons(task, language));
      setLoading(false);
    }, 800);
  };

  const sorted = [...comparisons].sort((a, b) => b.metrics.overallScore - a.metrics.overallScore);
  const maxAccuracy = Math.max(...comparisons.map(c => c.metrics.accuracy), 1);
  const maxLatency = Math.max(...comparisons.map(c => c.metrics.latency), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('compare.title')}</h1>
        <p className="text-gray-500 mt-1">{t('compare.subtitle')}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select
              label={t('compare.selectTask')}
              options={tasks.map(tk => ({ value: tk.value, label: t(`compare.${tk.labelKey}`) }))}
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <Select
              label={t('scorecard.selectLanguage')}
              options={SUPPORTED_LANGUAGES.filter(l => ['ko', 'ja', 'hi', 'ar'].includes(l.code)).map(l => ({
                value: l.code,
                label: `${l.nativeName} (${l.name})`,
              }))}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <Button onClick={handleCompare} disabled={loading} size="lg">
              {loading ? t('common.loading') : t('compare.selectModels')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {sorted.length > 0 && (
        <div className="space-y-6 animate-slide-up">
          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('compare.metrics')}</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-sovereign-500" />
                    <span className="text-xs text-gray-500">Sovereign</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-hanul-500" />
                    <span className="text-xs text-gray-500">Global</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('compare.accuracy')}</th>
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('compare.latency')}</th>
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('compare.cost')}</th>
                      <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{t('compare.overall')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sorted.map((model, i) => (
                      <tr key={model.modelId} className="hover:bg-gray-50">
                        <td className="py-3">
                          <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-yellow-100 text-yellow-700' :
                            i === 1 ? 'bg-gray-100 text-gray-600' :
                            i === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-50 text-gray-400'
                          }`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-medium text-gray-900">{model.modelName}</span>
                        </td>
                        <td className="py-3">
                          <Badge variant={model.type === 'sovereign' ? 'sovereign' : 'global'}>
                            {model.type}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Progress value={model.metrics.accuracy} max={100} size="sm" color="blue" className="w-20" />
                            <span className="text-sm text-gray-700">{model.metrics.accuracy.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`text-sm ${model.metrics.latency < 200 ? 'text-green-600' : model.metrics.latency < 350 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {model.metrics.latency.toFixed(0)}ms
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-700">${model.metrics.cost.toFixed(3)}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-lg font-bold text-gray-900">{model.metrics.overallScore.toFixed(1)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Visual comparison - accuracy bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('compare.accuracy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sorted.map((model) => (
                    <div key={model.modelId} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{model.modelName}</span>
                          <Badge variant={model.type === 'sovereign' ? 'sovereign' : 'global'} className="text-[10px]">
                            {model.type}
                          </Badge>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{model.metrics.accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className={`h-full rounded-lg transition-all duration-700 ${
                            model.type === 'sovereign' ? 'bg-gradient-to-r from-sovereign-400 to-sovereign-600' : 'bg-gradient-to-r from-hanul-400 to-hanul-600'
                          }`}
                          style={{ width: `${(model.metrics.accuracy / maxAccuracy) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('compare.latency')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...sorted].sort((a, b) => a.metrics.latency - b.metrics.latency).map((model) => (
                    <div key={model.modelId} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{model.modelName}</span>
                          <Badge variant={model.type === 'sovereign' ? 'sovereign' : 'global'} className="text-[10px]">
                            {model.type}
                          </Badge>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{model.metrics.latency.toFixed(0)}ms</span>
                      </div>
                      <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className={`h-full rounded-lg transition-all duration-700 ${
                            model.metrics.latency < 200 ? 'bg-green-500' : model.metrics.latency < 350 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(model.metrics.latency / maxLatency) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost comparison */}
          <Card>
            <CardHeader>
              <CardTitle>{t('compare.cost')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {sorted.map((model) => (
                  <div key={model.modelId} className="text-center p-4 bg-gray-50 rounded-xl">
                    <Badge variant={model.type === 'sovereign' ? 'sovereign' : 'global'} className="mb-2">
                      {model.type}
                    </Badge>
                    <p className="text-xs text-gray-500 mb-1">{model.modelName}</p>
                    <p className="text-xl font-bold text-gray-900">${model.metrics.cost.toFixed(3)}</p>
                    <p className="text-[10px] text-gray-400">per 1K tokens</p>
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
