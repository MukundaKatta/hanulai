import { NextRequest, NextResponse } from 'next/server';
import { generateModelComparisons } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, language } = body;

    if (!task || !language) {
      return NextResponse.json({ error: 'task and language are required' }, { status: 400 });
    }

    const comparisons = generateModelComparisons(task, language);
    return NextResponse.json({ comparisons });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
