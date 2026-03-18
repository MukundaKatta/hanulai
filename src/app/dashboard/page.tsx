'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const recentActivity = [
  { type: 'evaluation', model: 'SOLAR-10.7B-Ko', language: 'Korean', score: 87, time: '2h ago' },
  { type: 'compliance', model: 'GPT-4', country: 'South Korea', status: 'partial', time: '4h ago' },
  { type: 'quiz', language: 'Japanese', score: 75, questions: 8, time: '6h ago' },
  { type: 'localization', model: 'Llama 3 70B', language: 'Hindi', progress: 65, time: '8h ago' },
  { type: 'bilingual', model: 'EXAONE 3.0', languages: 'KO-EN', bleu: 0.82, time: '12h ago' },
];

const topModels = [
  { name: 'SOLAR-10.7B-Ko', type: 'sovereign' as const, score: 87, language: 'Korean' },
  { name: 'GPT-4', type: 'global' as const, score: 85, language: 'Multilingual' },
  { name: 'PLaMo-13B', type: 'sovereign' as const, score: 82, language: 'Japanese' },
  { name: 'Claude 3 Opus', type: 'global' as const, score: 81, language: 'Multilingual' },
  { name: 'Airavata', type: 'sovereign' as const, score: 79, language: 'Hindi' },
];

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('nav.dashboard')}</h1>
        <p className="text-gray-500 mt-1">{t('app.tagline')}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: t('home.stats.languages'), value: '8', color: 'from-hanul-500 to-hanul-600', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
          { label: t('home.stats.models'), value: '10', color: 'from-sovereign-500 to-sovereign-600', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { label: t('home.stats.benchmarks'), value: '547', color: 'from-green-500 to-green-600', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { label: t('home.stats.countries'), value: '15', color: 'from-orange-500 to-orange-600', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick links */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {[
                { href: '/scorecard', label: t('nav.scorecard'), color: 'bg-hanul-50 text-hanul-700 hover:bg-hanul-100' },
                { href: '/evaluation', label: t('nav.evaluation'), color: 'bg-sovereign-50 text-sovereign-700 hover:bg-sovereign-100' },
                { href: '/quiz', label: t('nav.quiz'), color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                { href: '/compliance', label: t('nav.compliance'), color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
                { href: '/compare', label: t('nav.compare'), color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${link.color}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top models */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Performing Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topModels.map((model, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400 w-5">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{model.name}</p>
                      <p className="text-xs text-gray-500">{model.language}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={model.type === 'sovereign' ? 'sovereign' : 'global'}>{model.type}</Badge>
                    <span className="text-sm font-bold text-gray-900">{model.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    act.type === 'evaluation' ? 'bg-hanul-500' :
                    act.type === 'compliance' ? 'bg-orange-500' :
                    act.type === 'quiz' ? 'bg-green-500' :
                    act.type === 'localization' ? 'bg-sovereign-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {act.type === 'evaluation' && `${act.model} scored ${act.score}% on ${act.language}`}
                      {act.type === 'compliance' && `${act.model} compliance check: ${act.status} (${act.country})`}
                      {act.type === 'quiz' && `${act.language} quiz: ${act.score}% (${act.questions} questions)`}
                      {act.type === 'localization' && `${act.model} for ${act.language}: ${act.progress}% complete`}
                      {act.type === 'bilingual' && `${act.model} ${act.languages} BLEU: ${act.bleu}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language coverage */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Language Coverage Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { lang: 'Korean', code: 'ko', progress: 92, models: 3 },
              { lang: 'Japanese', code: 'ja', progress: 85, models: 2 },
              { lang: 'Hindi', code: 'hi', progress: 72, models: 1 },
              { lang: 'Arabic', code: 'ar', progress: 68, models: 1 },
            ].map((lang) => (
              <div key={lang.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{lang.lang}</span>
                  <span className="text-sm text-gray-500">{lang.models} models</span>
                </div>
                <Progress value={lang.progress} color={lang.progress > 85 ? 'green' : lang.progress > 70 ? 'blue' : 'yellow'} showLabel />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
