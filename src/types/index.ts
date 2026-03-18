// ===== Model Types =====
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'sovereign' | 'global';
  languages: string[];
  parameters: string;
  description: string;
}

// ===== Scorecard Types =====
export interface ScorecardDimension {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  grade: 'excellent' | 'good' | 'fair' | 'poor' | 'failing';
  details: string;
}

export interface ScorecardResult {
  modelId: string;
  language: string;
  overallScore: number;
  overallGrade: string;
  dimensions: ScorecardDimension[];
  timestamp: string;
}

// ===== Evaluation Types =====
export interface EvaluationCategory {
  id: string;
  name: string;
  questions: number;
  passed: number;
  failed: number;
  score: number;
}

export interface EvaluationResult {
  language: string;
  modelId: string;
  categories: EvaluationCategory[];
  overallScore: number;
  timestamp: string;
}

// ===== Search Types =====
export interface SearchQuery {
  text: string;
  language: string;
  intent: string;
  entities: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevanceScore: number;
  source: string;
  language: string;
}

// ===== Quiz Types =====
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizResult {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  score: number;
  answers: { questionId: string; selected: number; correct: boolean }[];
}

// ===== Localization Pipeline Types =====
export type PipelineStatus = 'idle' | 'preparing' | 'training' | 'evaluating' | 'complete' | 'failed';

export interface LocalizationJob {
  id: string;
  baseModel: string;
  targetLanguage: string;
  dataSize: string;
  epochs: number;
  learningRate: number;
  status: PipelineStatus;
  progress: number;
  metrics?: {
    loss: number;
    accuracy: number;
    perplexity: number;
  };
}

// ===== Bilingual Types =====
export type BilingualTestType = 'translation' | 'codeSwitch' | 'mixed' | 'cultural';

export interface BilingualResult {
  testType: BilingualTestType;
  sourceLang: string;
  targetLang: string;
  input: string;
  output: string;
  metrics: {
    bleu: number;
    comet: number;
    humanScore: number;
  };
}

// ===== Compliance Types =====
export type ComplianceStatus = 'compliant' | 'partial' | 'nonCompliant' | 'unknown';

export interface ComplianceCategory {
  id: string;
  name: string;
  status: ComplianceStatus;
  details: string;
  requirements: string[];
}

export interface ComplianceResult {
  country: string;
  modelId: string;
  overallStatus: ComplianceStatus;
  categories: ComplianceCategory[];
  recommendations: string[];
  timestamp: string;
}

// ===== Comparison Types =====
export interface ModelComparison {
  modelId: string;
  modelName: string;
  type: 'sovereign' | 'global';
  task: string;
  language: string;
  metrics: {
    accuracy: number;
    latency: number;
    cost: number;
    overallScore: number;
  };
}

// ===== Language Config =====
export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: 'KR', region: 'East Asia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: 'JP', region: 'East Asia' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: 'IN', region: 'South Asia' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'SA', region: 'Middle East' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: 'CN', region: 'East Asia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: 'TH', region: 'Southeast Asia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: 'VN', region: 'Southeast Asia' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: 'ID', region: 'Southeast Asia' },
];

export const AVAILABLE_MODELS: AIModel[] = [
  { id: 'ko-solar', name: 'SOLAR-10.7B-Ko', provider: 'Upstage', type: 'sovereign', languages: ['ko'], parameters: '10.7B', description: 'Korean-optimized large language model' },
  { id: 'ko-exaone', name: 'EXAONE 3.0', provider: 'LG AI Research', type: 'sovereign', languages: ['ko'], parameters: '7.8B', description: 'Korean enterprise AI model' },
  { id: 'ja-rinna', name: 'Rinna-3.6B', provider: 'Rinna', type: 'sovereign', languages: ['ja'], parameters: '3.6B', description: 'Japanese language model' },
  { id: 'ja-plamo', name: 'PLaMo-13B', provider: 'Preferred Networks', type: 'sovereign', languages: ['ja'], parameters: '13B', description: 'Japanese foundation model' },
  { id: 'hi-airavata', name: 'Airavata', provider: 'AI4Bharat', type: 'sovereign', languages: ['hi'], parameters: '7B', description: 'Hindi instruction-tuned model' },
  { id: 'ar-jais', name: 'Jais-13B', provider: 'G42', type: 'sovereign', languages: ['ar'], parameters: '13B', description: 'Arabic-English bilingual model' },
  { id: 'gpt4', name: 'GPT-4', provider: 'OpenAI', type: 'global', languages: ['multilingual'], parameters: '~1.8T', description: 'Largest global multilingual model' },
  { id: 'claude3', name: 'Claude 3 Opus', provider: 'Anthropic', type: 'global', languages: ['multilingual'], parameters: 'Unknown', description: 'Advanced multilingual reasoning' },
  { id: 'gemini', name: 'Gemini Pro', provider: 'Google', type: 'global', languages: ['multilingual'], parameters: 'Unknown', description: 'Google multimodal AI' },
  { id: 'llama3', name: 'Llama 3 70B', provider: 'Meta', type: 'global', languages: ['multilingual'], parameters: '70B', description: 'Open-source multilingual model' },
];
