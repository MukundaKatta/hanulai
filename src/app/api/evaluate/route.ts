import { NextRequest, NextResponse } from 'next/server';
import { generateScorecardResult, generateEvaluationResult } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, modelId, language } = body;

    if (!modelId || !language) {
      return NextResponse.json({ error: 'modelId and language are required' }, { status: 400 });
    }

    if (type === 'scorecard') {
      const result = generateScorecardResult(modelId, language);
      return NextResponse.json(result);
    }

    if (type === 'evaluation') {
      const result = generateEvaluationResult(language, modelId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid evaluation type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
