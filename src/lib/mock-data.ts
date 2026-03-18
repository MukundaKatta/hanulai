import {
  ScorecardResult,
  EvaluationResult,
  SearchResult,
  QuizQuestion,
  BilingualResult,
  ComplianceResult,
  ModelComparison,
  LocalizationJob,
} from '@/types';

export function generateScorecardResult(modelId: string, language: string): ScorecardResult {
  const dimensionKeys = [
    'fluency', 'grammar', 'vocabulary', 'cultural', 'idioms',
    'formality', 'technical', 'creative', 'reasoning', 'safety',
  ];

  const isSovereign = !['gpt4', 'claude3', 'gemini', 'llama3'].includes(modelId);
  const langMatch = modelId.startsWith(language.substring(0, 2));

  const dimensions = dimensionKeys.map((key) => {
    let baseScore = isSovereign && langMatch ? 75 + Math.random() * 20 : 55 + Math.random() * 30;
    if (key === 'cultural' && isSovereign && langMatch) baseScore = Math.min(98, baseScore + 10);
    if (key === 'reasoning' && !isSovereign) baseScore = Math.min(95, baseScore + 5);
    const score = Math.round(baseScore);
    const grade = score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'fair' : score >= 40 ? 'poor' : 'failing';
    return { key, label: key, score, maxScore: 100, grade: grade as any, details: `${key} evaluation for ${language}` };
  });

  const overallScore = Math.round(dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length);

  return {
    modelId,
    language,
    overallScore,
    overallGrade: overallScore >= 90 ? 'A+' : overallScore >= 80 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 60 ? 'C' : 'D',
    dimensions,
    timestamp: new Date().toISOString(),
  };
}

export function generateEvaluationResult(language: string, modelId: string): EvaluationResult {
  const cats = [
    { id: 'history', name: 'History & Traditions' },
    { id: 'literature', name: 'Literature & Arts' },
    { id: 'customs', name: 'Social Customs' },
    { id: 'cuisine', name: 'Food & Cuisine' },
    { id: 'geography', name: 'Geography & Places' },
    { id: 'politics', name: 'Government & Politics' },
    { id: 'religion', name: 'Religion & Philosophy' },
    { id: 'media', name: 'Media & Entertainment' },
  ];

  const categories = cats.map((c) => {
    const total = 20;
    const passed = Math.floor(10 + Math.random() * 10);
    return { id: c.id, name: c.name, questions: total, passed, failed: total - passed, score: Math.round((passed / total) * 100) };
  });

  return {
    language,
    modelId,
    categories,
    overallScore: Math.round(categories.reduce((a, c) => a + c.score, 0) / categories.length),
    timestamp: new Date().toISOString(),
  };
}

const searchData: Record<string, SearchResult[]> = {
  ko: [
    { id: '1', title: '한국의 전통 음식 문화', url: 'https://example.com/korean-food', snippet: '한국의 전통 음식은 발효 식품을 기반으로 하며, 김치, 된장, 간장 등이 대표적입니다. 계절에 따라 다양한 제철 음식을 즐기는 것이 특징입니다.', relevanceScore: 0.95, source: 'Korean Culture Encyclopedia', language: 'ko' },
    { id: '2', title: '한글의 과학적 원리', url: 'https://example.com/hangul', snippet: '세종대왕이 창제한 한글은 발음 기관의 모양을 본따 만든 과학적인 문자 체계입니다. 자음 14자와 모음 10자로 구성되어 있습니다.', relevanceScore: 0.88, source: 'National Hangul Museum', language: 'ko' },
    { id: '3', title: 'K-POP의 글로벌 영향력', url: 'https://example.com/kpop', snippet: 'K-POP은 한국의 대중음악으로, BTS, BLACKPINK 등의 아티스트를 통해 전 세계적인 문화 현상이 되었습니다.', relevanceScore: 0.82, source: 'Korean Wave Research', language: 'ko' },
  ],
  ja: [
    { id: '1', title: '日本の伝統文化と現代', url: 'https://example.com/japan-culture', snippet: '日本の伝統文化は茶道、華道、書道など多岐にわたります。現代でもこれらの文化は大切に受け継がれています。', relevanceScore: 0.93, source: 'Japan Cultural Heritage', language: 'ja' },
    { id: '2', title: '日本語の敬語体系', url: 'https://example.com/keigo', snippet: '日本語の敬語は尊敬語、謙譲語、丁寧語の3種類に分類され、社会的な関係性を表現する重要な言語要素です。', relevanceScore: 0.89, source: 'Japanese Linguistics', language: 'ja' },
    { id: '3', title: 'アニメ産業の経済効果', url: 'https://example.com/anime', snippet: '日本のアニメ産業は年間2.5兆円規模の市場を持ち、海外での人気も年々高まっています。', relevanceScore: 0.85, source: 'Anime Industry Report', language: 'ja' },
  ],
  hi: [
    { id: '1', title: 'भारतीय संस्कृति की विविधता', url: 'https://example.com/indian-culture', snippet: 'भारत की संस्कृति विश्व की सबसे पुरानी और विविध संस्कृतियों में से एक है। यहाँ 22 आधिकारिक भाषाएँ और सैकड़ों बोलियाँ बोली जाती हैं।', relevanceScore: 0.94, source: 'Indian Heritage Portal', language: 'hi' },
    { id: '2', title: 'हिंदी साहित्य का इतिहास', url: 'https://example.com/hindi-literature', snippet: 'हिंदी साहित्य का इतिहास आदिकाल से लेकर आधुनिक काल तक फैला हुआ है। तुलसीदास, कबीर, प्रेमचंद जैसे महान लेखकों ने इसे समृद्ध किया है।', relevanceScore: 0.87, source: 'Hindi Sahitya Academy', language: 'hi' },
    { id: '3', title: 'बॉलीवुड का वैश्विक प्रभाव', url: 'https://example.com/bollywood', snippet: 'बॉलीवुड विश्व का सबसे बड़ा फिल्म उद्योग है जो प्रति वर्ष 1500 से अधिक फिल्में बनाता है।', relevanceScore: 0.81, source: 'Indian Cinema Studies', language: 'hi' },
  ],
};

export function getSearchResults(query: string, language: string): { results: SearchResult[]; analysis: { intent: string; language: string; entities: string[] } } {
  const results = searchData[language] || searchData['ko'];
  const entities = query.split(/\s+/).filter(w => w.length > 2);
  return {
    results,
    analysis: {
      intent: 'informational',
      language,
      entities,
    },
  };
}

const quizData: Record<string, QuizQuestion[]> = {
  ko: [
    { id: 'ko1', question: '한글을 창제한 왕은 누구입니까?', options: ['태종', '세종대왕', '영조', '정조'], correctAnswer: 1, explanation: '세종대왕은 1443년에 한글(훈민정음)을 창제하였습니다.', category: 'history', difficulty: 'easy' },
    { id: 'ko2', question: '한국의 전통 발효 양념으로 고추장, 된장과 함께 대표적인 것은?', options: ['참기름', '간장', '식초', '고춧가루'], correctAnswer: 1, explanation: '간장은 한국의 3대 기본 발효 양념 중 하나입니다.', category: 'cuisine', difficulty: 'easy' },
    { id: 'ko3', question: '"빈대떡"의 주재료는 무엇입니까?', options: ['쌀가루', '녹두', '밀가루', '감자'], correctAnswer: 1, explanation: '빈대떡은 녹두를 갈아 만든 한국 전통 부침개입니다.', category: 'cuisine', difficulty: 'medium' },
    { id: 'ko4', question: '판소리에서 소리꾼을 반주하는 악기는?', options: ['가야금', '거문고', '북', '대금'], correctAnswer: 2, explanation: '판소리에서 고수가 북으로 반주를 합니다.', category: 'culture', difficulty: 'medium' },
    { id: 'ko5', question: '한국에서 "화이팅"이라는 표현의 의미는?', options: ['싸우다', '격려/응원', '포기하다', '운동하다'], correctAnswer: 1, explanation: '"화이팅"은 한국에서 격려와 응원의 의미로 널리 사용되는 표현입니다.', category: 'customs', difficulty: 'easy' },
    { id: 'ko6', question: '조선시대의 신분 제도에서 가장 높은 계급은?', options: ['중인', '양반', '상민', '천민'], correctAnswer: 1, explanation: '양반은 조선시대 사회 계급 중 가장 높은 계급이었습니다.', category: 'history', difficulty: 'medium' },
    { id: 'ko7', question: '한국의 전통 가옥 양식을 무엇이라 합니까?', options: ['한옥', '초가집', '기와집', '너와집'], correctAnswer: 0, explanation: '한옥은 한국의 전통 건축 양식을 총칭하는 말입니다.', category: 'culture', difficulty: 'easy' },
    { id: 'ko8', question: '다음 중 한국의 유네스코 세계유산이 아닌 것은?', options: ['불국사', '창덕궁', '해인사 장경판전', '도쿄 타워'], correctAnswer: 3, explanation: '도쿄 타워는 일본에 위치하며 한국의 유네스코 세계유산이 아닙니다.', category: 'geography', difficulty: 'easy' },
  ],
  ja: [
    { id: 'ja1', question: '日本の首都が東京になったのはいつですか？', options: ['1600年', '1868年', '1945年', '1964年'], correctAnswer: 1, explanation: '1868年の明治維新により、首都が京都から東京に移されました。', category: 'history', difficulty: 'easy' },
    { id: 'ja2', question: '日本の国花は何ですか？', options: ['バラ', '菊', '桜', '梅'], correctAnswer: 1, explanation: '菊は皇室の紋章に使われる日本の国花です。桜は事実上のシンボルですが、公式の国花は菊です。', category: 'culture', difficulty: 'medium' },
    { id: 'ja3', question: '「わび・さび」の概念を最もよく表すものは？', options: ['華やかな装飾', '質素で不完全な美', '最新技術', '大規模なイベント'], correctAnswer: 1, explanation: 'わび・さびは質素さ、不完全さ、無常の中に美を見出す日本独自の美意識です。', category: 'philosophy', difficulty: 'medium' },
    { id: 'ja4', question: '寿司の「しゃり」とは何を指しますか？', options: ['魚', '酢飯', 'わさび', '海苔'], correctAnswer: 1, explanation: 'しゃりとは寿司に使われる酢飯のことです。', category: 'cuisine', difficulty: 'easy' },
    { id: 'ja5', question: '日本で最も古い小説とされる作品は？', options: ['枕草子', '源氏物語', '竹取物語', '徒然草'], correctAnswer: 2, explanation: '竹取物語は10世紀初頭に書かれた、日本最古の物語文学とされています。', category: 'literature', difficulty: 'medium' },
    { id: 'ja6', question: '日本の「お盆」は何を目的とした行事ですか？', options: ['新年の祝い', '先祖の霊を迎える', '収穫祭', '成人式'], correctAnswer: 1, explanation: 'お盆は先祖の霊を家に迎えて供養する日本の伝統行事です。', category: 'customs', difficulty: 'easy' },
    { id: 'ja7', question: '能楽で使われる仮面を何と呼びますか？', options: ['お面', '能面', '仮面', '般若'], correctAnswer: 1, explanation: '能面（のうめん）は能楽で使用される伝統的な仮面です。', category: 'culture', difficulty: 'medium' },
    { id: 'ja8', question: '日本の47都道府県で面積が最大なのは？', options: ['北海道', '東京都', '新潟県', '長野県'], correctAnswer: 0, explanation: '北海道は日本最大の都道府県で、面積は約83,000平方キロメートルです。', category: 'geography', difficulty: 'easy' },
  ],
  hi: [
    { id: 'hi1', question: 'भारत का राष्ट्रीय पक्षी कौन सा है?', options: ['तोता', 'कबूतर', 'मोर', 'बाज'], correctAnswer: 2, explanation: 'मोर भारत का राष्ट्रीय पक्षी है, जिसे 1963 में राष्ट्रीय पक्षी घोषित किया गया।', category: 'culture', difficulty: 'easy' },
    { id: 'hi2', question: 'हिंदी दिवस कब मनाया जाता है?', options: ['26 जनवरी', '15 अगस्त', '14 सितंबर', '2 अक्टूबर'], correctAnswer: 2, explanation: '14 सितंबर को हिंदी दिवस मनाया जाता है क्योंकि इसी दिन 1949 में हिंदी को राजभाषा का दर्जा दिया गया।', category: 'history', difficulty: 'easy' },
    { id: 'hi3', question: '"रामचरितमानस" के रचयिता कौन हैं?', options: ['कालिदास', 'तुलसीदास', 'कबीर', 'सूरदास'], correctAnswer: 1, explanation: 'रामचरितमानस की रचना गोस्वामी तुलसीदास ने 16वीं शताब्दी में की।', category: 'literature', difficulty: 'easy' },
    { id: 'hi4', question: 'भारतीय शास्त्रीय संगीत की दो प्रमुख पद्धतियाँ कौन सी हैं?', options: ['भरतनाट्यम और कथक', 'हिंदुस्तानी और कर्नाटक', 'ध्रुपद और खयाल', 'राग और ताल'], correctAnswer: 1, explanation: 'भारतीय शास्त्रीय संगीत की दो प्रमुख पद्धतियाँ हिंदुस्तानी (उत्तर भारतीय) और कर्नाटक (दक्षिण भारतीय) हैं।', category: 'culture', difficulty: 'medium' },
    { id: 'hi5', question: '"नमस्ते" का शाब्दिक अर्थ क्या है?', options: ['शुभ प्रभात', 'मैं आपको नमन करता हूँ', 'कैसे हैं आप', 'धन्यवाद'], correctAnswer: 1, explanation: '"नमस्ते" संस्कृत शब्द है जिसका अर्थ है "मैं आपके भीतर के दिव्य को नमन करता हूँ"।', category: 'customs', difficulty: 'easy' },
    { id: 'hi6', question: 'दीवाली किस भगवान की घर वापसी से जुड़ी है?', options: ['कृष्ण', 'शिव', 'राम', 'गणेश'], correctAnswer: 2, explanation: 'दीवाली भगवान राम के 14 वर्ष के वनवास के बाद अयोध्या लौटने की खुशी में मनाई जाती है।', category: 'religion', difficulty: 'easy' },
    { id: 'hi7', question: 'भारत में कुल कितने राज्य हैं (2024)?', options: ['25', '28', '29', '30'], correctAnswer: 1, explanation: '2024 तक भारत में 28 राज्य और 8 केंद्र शासित प्रदेश हैं।', category: 'geography', difficulty: 'medium' },
    { id: 'hi8', question: 'बॉलीवुड की पहली बोलती फिल्म कौन सी थी?', options: ['मुगल-ए-आज़म', 'आलम आरा', 'शोले', 'मदर इंडिया'], correctAnswer: 1, explanation: '1931 में रिलीज हुई "आलम आरा" भारतीय सिनेमा की पहली बोलती (टॉकी) फिल्म थी।', category: 'media', difficulty: 'medium' },
  ],
};

export function getQuizQuestions(language: string, difficulty?: string): QuizQuestion[] {
  const questions = quizData[language] || quizData['ko'];
  if (difficulty && difficulty !== 'all') {
    return questions.filter(q => q.difficulty === difficulty);
  }
  return questions;
}

export function generateBilingualResults(sourceLang: string, targetLang: string, testType: string): BilingualResult[] {
  const samples: Record<string, { input: string; output: string }[]> = {
    'ko-en': [
      { input: '오늘 날씨가 정말 좋네요. 산책하러 갈까요?', output: "The weather is really nice today. Shall we go for a walk?" },
      { input: '이 문제를 해결하기 위해 다양한 approach를 시도해 봤어요.', output: "I tried various approaches to solve this problem." },
    ],
    'ja-en': [
      { input: '日本の桜の季節は本当に美しいですね。', output: "The cherry blossom season in Japan is truly beautiful." },
      { input: '新しいプロジェクトのdeadlineが近づいています。', output: "The deadline for the new project is approaching." },
    ],
    'hi-en': [
      { input: 'भारत की विविधता में एकता सबसे बड़ी ताकत है।', output: "Unity in diversity is India's greatest strength." },
      { input: 'मुझे इस project की deadline के बारे में बताइए।', output: "Please tell me about this project's deadline." },
    ],
  };

  const key = `${sourceLang}-${targetLang}`;
  const pairs = samples[key] || samples['ko-en'];

  return pairs.map((p, i) => ({
    testType: testType as any,
    sourceLang,
    targetLang,
    input: p.input,
    output: p.output,
    metrics: {
      bleu: 0.65 + Math.random() * 0.3,
      comet: 0.7 + Math.random() * 0.25,
      humanScore: 3.5 + Math.random() * 1.5,
    },
  }));
}

export function generateComplianceResult(country: string, modelId: string): ComplianceResult {
  const countryReqs: Record<string, { categories: { id: string; name: string; status: string; details: string; requirements: string[] }[]; recommendations: string[] }> = {
    KR: {
      categories: [
        { id: 'dataResidency', name: 'Data Residency', status: 'compliant', details: 'Data stored within South Korean borders', requirements: ['Personal Information Protection Act (PIPA)', 'Cloud Computing Act'] },
        { id: 'privacy', name: 'Privacy Regulations', status: 'compliant', details: 'PIPA compliance verified', requirements: ['Consent management', 'Data minimization', 'Purpose limitation'] },
        { id: 'contentFiltering', name: 'Content Filtering', status: 'partial', details: 'Basic filtering in place, advanced filtering needed', requirements: ['Harmful content detection', 'Misinformation filtering'] },
        { id: 'transparency', name: 'Transparency', status: 'compliant', details: 'Model documentation provided', requirements: ['AI disclosure requirements', 'Algorithmic transparency'] },
        { id: 'audit', name: 'Audit Trail', status: 'partial', details: 'Partial logging implemented', requirements: ['Full interaction logging', 'Decision audit trail'] },
        { id: 'localEntity', name: 'Local Entity', status: 'nonCompliant', details: 'No local entity established', requirements: ['Korean business registration', 'Local data protection officer'] },
      ],
      recommendations: ['Establish local business entity in South Korea', 'Implement comprehensive audit logging', 'Enhance content filtering for Korean-specific harmful content'],
    },
    JP: {
      categories: [
        { id: 'dataResidency', name: 'Data Residency', status: 'partial', details: 'APPI-compliant cross-border transfer', requirements: ['Act on Protection of Personal Information (APPI)', 'Supplementary Rules'] },
        { id: 'privacy', name: 'Privacy Regulations', status: 'compliant', details: 'APPI compliance verified', requirements: ['Consent for sensitive data', 'Anonymization standards'] },
        { id: 'contentFiltering', name: 'Content Filtering', status: 'compliant', details: 'Content filtering meets standards', requirements: ['Harmful content detection', 'Copyright protection'] },
        { id: 'transparency', name: 'Transparency', status: 'partial', details: 'Partial transparency documentation', requirements: ['AI usage disclosure', 'Fairness requirements'] },
        { id: 'audit', name: 'Audit Trail', status: 'compliant', details: 'Full audit trail in place', requirements: ['Data processing records', 'Security incident logs'] },
        { id: 'localEntity', name: 'Local Entity', status: 'compliant', details: 'Local representative designated', requirements: ['Japanese entity or representative', 'PPC registration'] },
      ],
      recommendations: ['Strengthen data residency for complete compliance', 'Expand transparency documentation', 'Regular APPI compliance audits'],
    },
    IN: {
      categories: [
        { id: 'dataResidency', name: 'Data Residency', status: 'partial', details: 'DPDP Act requirements partially met', requirements: ['Digital Personal Data Protection Act 2023', 'Data localization for sensitive data'] },
        { id: 'privacy', name: 'Privacy Regulations', status: 'partial', details: 'DPDP Act compliance in progress', requirements: ['Consent management', 'Data fiduciary obligations'] },
        { id: 'contentFiltering', name: 'Content Filtering', status: 'compliant', details: 'IT Act compliance verified', requirements: ['Information Technology Act 2000', 'Intermediary Guidelines'] },
        { id: 'transparency', name: 'Transparency', status: 'nonCompliant', details: 'Insufficient transparency measures', requirements: ['AI governance framework', 'Algorithmic accountability'] },
        { id: 'audit', name: 'Audit Trail', status: 'partial', details: 'Basic audit capabilities', requirements: ['Data processing logs', 'Breach notification system'] },
        { id: 'localEntity', name: 'Local Entity', status: 'compliant', details: 'Indian entity established', requirements: ['Indian company registration', 'Grievance officer appointment'] },
      ],
      recommendations: ['Complete DPDP Act compliance', 'Implement full transparency framework', 'Enhance audit trail capabilities', 'Appoint AI ethics officer'],
    },
  };

  const data = countryReqs[country] || countryReqs['KR'];
  const compliantCount = data.categories.filter(c => c.status === 'compliant').length;
  const overallStatus = compliantCount === data.categories.length ? 'compliant' : compliantCount >= data.categories.length / 2 ? 'partial' : 'nonCompliant';

  return {
    country,
    modelId,
    overallStatus: overallStatus as any,
    categories: data.categories as any,
    recommendations: data.recommendations,
    timestamp: new Date().toISOString(),
  };
}

export function generateModelComparisons(task: string, language: string): ModelComparison[] {
  return [
    { modelId: 'ko-solar', modelName: 'SOLAR-10.7B-Ko', type: 'sovereign', task, language, metrics: { accuracy: 82 + Math.random() * 10, latency: 120 + Math.random() * 80, cost: 0.002, overallScore: 85 + Math.random() * 8 } },
    { modelId: 'ko-exaone', modelName: 'EXAONE 3.0', type: 'sovereign', task, language, metrics: { accuracy: 78 + Math.random() * 12, latency: 150 + Math.random() * 100, cost: 0.003, overallScore: 80 + Math.random() * 10 } },
    { modelId: 'ja-plamo', modelName: 'PLaMo-13B', type: 'sovereign', task, language, metrics: { accuracy: 76 + Math.random() * 14, latency: 180 + Math.random() * 70, cost: 0.004, overallScore: 78 + Math.random() * 10 } },
    { modelId: 'gpt4', modelName: 'GPT-4', type: 'global', task, language, metrics: { accuracy: 85 + Math.random() * 8, latency: 300 + Math.random() * 200, cost: 0.03, overallScore: 82 + Math.random() * 8 } },
    { modelId: 'claude3', modelName: 'Claude 3 Opus', type: 'global', task, language, metrics: { accuracy: 83 + Math.random() * 10, latency: 280 + Math.random() * 150, cost: 0.025, overallScore: 81 + Math.random() * 9 } },
    { modelId: 'llama3', modelName: 'Llama 3 70B', type: 'global', task, language, metrics: { accuracy: 72 + Math.random() * 15, latency: 200 + Math.random() * 100, cost: 0.008, overallScore: 74 + Math.random() * 12 } },
  ];
}

export function generateLocalizationJob(baseModel: string, targetLanguage: string): LocalizationJob {
  return {
    id: Math.random().toString(36).substring(7),
    baseModel,
    targetLanguage,
    dataSize: '50GB',
    epochs: 3,
    learningRate: 0.0001,
    status: 'idle',
    progress: 0,
  };
}
