'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AVAILABLE_MODELS, SUPPORTED_LANGUAGES } from '@/types';
import type { PipelineStatus } from '@/types';

const steps = ['select', 'configure', 'data', 'train', 'evaluate', 'deploy'] as const;

export default function LocalizationPage() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const [baseModel, setBaseModel] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [epochs, setEpochs] = useState('3');
  const [learningRate, setLearningRate] = useState('0.0001');
  const [dataSize, setDataSize] = useState('50');
  const [status, setStatus] = useState<PipelineStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<{ loss: number; accuracy: number; perplexity: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const canProceed = () => {
    if (currentStep === 0) return !!baseModel;
    if (currentStep === 1) return !!targetLang;
    return true;
  };

  const startTraining = () => {
    setStatus('preparing');
    setProgress(0);

    let p = 0;
    timerRef.current = setInterval(() => {
      p += Math.random() * 3 + 1;
      if (p > 100) p = 100;

      setProgress(p);

      if (p < 15) setStatus('preparing');
      else if (p < 85) setStatus('training');
      else if (p < 95) setStatus('evaluating');

      if (p >= 100) {
        clearInterval(timerRef.current!);
        setStatus('complete');
        setMetrics({
          loss: 0.12 + Math.random() * 0.1,
          accuracy: 82 + Math.random() * 12,
          perplexity: 8 + Math.random() * 5,
        });
        setCurrentStep(4);
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNext = () => {
    if (currentStep === 3 && status === 'idle') {
      startTraining();
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentStep(0);
    setBaseModel('');
    setTargetLang('');
    setStatus('idle');
    setProgress(0);
    setMetrics(null);
  };

  const statusColors: Record<PipelineStatus, string> = {
    idle: 'bg-gray-100 text-gray-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    training: 'bg-blue-100 text-blue-700',
    evaluating: 'bg-purple-100 text-purple-700',
    complete: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('localization.title')}</h1>
        <p className="text-gray-500 mt-1">{t('localization.subtitle')}</p>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < currentStep ? 'bg-green-500 text-white' :
                  i === currentStep ? 'bg-hanul-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {i < currentStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs mt-1 text-center ${i <= currentStep ? 'text-hanul-600 font-medium' : 'text-gray-400'}`}>
                  {t(`localization.steps.${step}`)}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-full mx-2 ${i < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('localization.steps.select')}</h3>
              <Select
                label={t('localization.baseModel')}
                options={[
                  { value: '', label: t('common.selectOption') },
                  ...AVAILABLE_MODELS.filter(m => m.type === 'global' || m.parameters.includes('70B') || m.parameters.includes('13B')).map(m => ({
                    value: m.id,
                    label: `${m.name} (${m.provider}) - ${m.parameters}`,
                  })),
                ]}
                value={baseModel}
                onChange={(e) => setBaseModel(e.target.value)}
              />
              {baseModel && (
                <div className="p-4 bg-hanul-50 rounded-lg">
                  <p className="text-sm text-hanul-700">
                    {AVAILABLE_MODELS.find(m => m.id === baseModel)?.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('localization.steps.configure')}</h3>
              <Select
                label={t('localization.targetLanguage')}
                options={[
                  { value: '', label: t('common.selectOption') },
                  ...SUPPORTED_LANGUAGES.map(l => ({ value: l.code, label: `${l.nativeName} (${l.name})` })),
                ]}
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('localization.epochs')}</label>
                  <input type="number" value={epochs} onChange={(e) => setEpochs(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('localization.learningRate')}</label>
                  <input type="text" value={learningRate} onChange={(e) => setLearningRate(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('localization.dataSize')} (GB)</label>
                  <input type="number" value={dataSize} onChange={(e) => setDataSize(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('localization.steps.data')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Wikipedia Corpus', 'News Articles', 'Government Documents', 'Literary Works', 'Conversational Data', 'Technical Documentation'].map((source) => (
                  <div key={source} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{source}</span>
                    <Badge variant="success" className="ml-auto">Ready</Badge>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Total: {dataSize}GB of {SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || 'target'} language data prepared
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">{t('localization.steps.train')}</h3>
              <div className="flex items-center justify-between">
                <Badge className={statusColors[status]}>{t(`localization.status.${status}`)}</Badge>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} size="lg" color={status === 'complete' ? 'green' : 'purple'} />

              {status !== 'idle' && (
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">{t('localization.baseModel')}</p>
                    <p className="text-sm font-medium mt-1">{AVAILABLE_MODELS.find(m => m.id === baseModel)?.name}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">{t('localization.targetLanguage')}</p>
                    <p className="text-sm font-medium mt-1">{SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.nativeName}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">{t('localization.epochs')}</p>
                    <p className="text-sm font-medium mt-1">{epochs}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && metrics && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">{t('localization.steps.evaluate')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border shadow-none">
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-gray-500">Loss</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{metrics.loss.toFixed(4)}</p>
                  </CardContent>
                </Card>
                <Card className="border shadow-none">
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-gray-500">Accuracy</p>
                    <p className="text-3xl font-bold text-hanul-600 mt-1">{metrics.accuracy.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card className="border shadow-none">
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-gray-500">Perplexity</p>
                    <p className="text-3xl font-bold text-sovereign-600 mt-1">{metrics.perplexity.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 font-medium">Fine-tuning complete. Model is ready for deployment.</p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{t('localization.status.complete')}</h3>
              <p className="text-gray-500">
                {AVAILABLE_MODELS.find(m => m.id === baseModel)?.name} has been fine-tuned for {SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.nativeName}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={handleReset}>{t('common.reset')}</Button>
                <Button>{t('common.download')}</Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0 || (currentStep === 3 && status !== 'idle')}
            >
              {t('common.previous')}
            </Button>
            {currentStep < 5 && (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || (currentStep === 3 && status !== 'idle' && status !== 'complete')}
              >
                {currentStep === 3 && status === 'idle' ? t('localization.startTraining') : t('common.next')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
