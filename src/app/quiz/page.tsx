'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SUPPORTED_LANGUAGES } from '@/types';
import { getQuizQuestions } from '@/lib/mock-data';
import type { QuizQuestion, QuizResult } from '@/types';

export default function QuizPage() {
  const t = useTranslations();
  const [language, setLanguage] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [started, setStarted] = useState(false);

  const handleGenerate = () => {
    if (!language) return;
    const qs = getQuizQuestions(language, difficulty);
    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowExplanation(false);
    setQuizComplete(false);
    setStarted(true);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    const q = questions[currentIndex];
    const correct = selectedAnswer === q.correctAnswer;
    setAnswers([...answers, { questionId: q.id, selected: selectedAnswer, correct }]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setQuizComplete(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowExplanation(false);
    setQuizComplete(false);
  };

  const correctCount = answers.filter(a => a.correct).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('quiz.title')}</h1>
        <p className="text-gray-500 mt-1">{t('quiz.subtitle')}</p>
      </div>

      {!started ? (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Select
                label={t('quiz.selectLanguage')}
                options={[
                  { value: '', label: t('common.selectOption') },
                  ...SUPPORTED_LANGUAGES.filter(l => ['ko', 'ja', 'hi'].includes(l.code)).map((l) => ({
                    value: l.code,
                    label: `${l.nativeName} (${l.name})`,
                  })),
                ]}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
              <Select
                label={t('quiz.difficulty')}
                options={[
                  { value: 'all', label: `-- ${t('common.selectOption')} --` },
                  { value: 'easy', label: t('quiz.easy') },
                  { value: 'medium', label: t('quiz.medium') },
                  { value: 'hard', label: t('quiz.hard') },
                ]}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              <Button onClick={handleGenerate} disabled={!language} size="lg">
                {t('quiz.generate')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : quizComplete ? (
        <div className="space-y-6 animate-slide-up">
          <Card>
            <CardHeader>
              <CardTitle>{t('quiz.results')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke={scorePercent >= 80 ? '#22c55e' : scorePercent >= 60 ? '#3b82f6' : '#f59e0b'}
                      strokeWidth="10"
                      strokeDasharray={`${(scorePercent / 100) * 314} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{scorePercent}%</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('quiz.score')}: {correctCount}/{questions.length}</h3>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Badge variant="success">{t('quiz.correct')}: {correctCount}</Badge>
                  <Badge variant="danger">{t('quiz.incorrect')}: {questions.length - correctCount}</Badge>
                </div>
                <Button onClick={handleReset}>{t('quiz.tryAgain')}</Button>
              </div>
            </CardContent>
          </Card>

          {/* Review answers */}
          <div className="space-y-3">
            {questions.map((q, i) => {
              const answer = answers[i];
              return (
                <Card key={q.id} className={`border-l-4 ${answer?.correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${answer?.correct ? 'bg-green-500' : 'bg-red-500'}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">{q.question}</p>
                        <p className="text-xs text-gray-500">
                          {answer?.correct ? t('quiz.correct') : `${t('quiz.incorrect')} — ${t('quiz.correct')}: ${q.options[q.correctAnswer]}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 italic">{q.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {t('quiz.question')} {currentIndex + 1} {t('quiz.of')} {questions.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleReset}>{t('common.reset')}</Button>
          </div>
          <Progress value={((currentIndex + (showExplanation ? 1 : 0)) / questions.length) * 100} size="sm" color="purple" />

          {/* Question */}
          {questions[currentIndex] && (
            <Card className="animate-slide-up">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-hanul-100 text-hanul-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {currentIndex + 1}
                  </span>
                  <h3 className="text-lg font-medium text-gray-900">{questions[currentIndex].question}</h3>
                </div>

                <div className="space-y-3 ml-11">
                  {questions[currentIndex].options.map((option, i) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = i === questions[currentIndex].correctAnswer;
                    const showResult = showExplanation;

                    return (
                      <button
                        key={i}
                        onClick={() => !showExplanation && setSelectedAnswer(i)}
                        disabled={showExplanation}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                          showResult
                            ? isCorrect
                              ? 'border-green-500 bg-green-50 text-green-900'
                              : isSelected
                                ? 'border-red-500 bg-red-50 text-red-900'
                                : 'border-gray-200 text-gray-500'
                            : isSelected
                              ? 'border-hanul-500 bg-hanul-50 text-hanul-900'
                              : 'border-gray-200 hover:border-hanul-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="mt-6 ml-11 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-1">{t('quiz.explanation')}</p>
                    <p className="text-sm text-blue-700">{questions[currentIndex].explanation}</p>
                  </div>
                )}

                <div className="flex justify-end mt-6 gap-3">
                  {!showExplanation ? (
                    <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
                      {t('quiz.submit')}
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      {currentIndex + 1 >= questions.length ? t('quiz.results') : t('quiz.next')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
