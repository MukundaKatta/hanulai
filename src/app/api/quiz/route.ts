import { NextRequest, NextResponse } from 'next/server';
import { getQuizQuestions } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'ko';
    const difficulty = searchParams.get('difficulty') || 'all';

    const questions = getQuizQuestions(language, difficulty);
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
