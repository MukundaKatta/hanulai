import { NextRequest, NextResponse } from 'next/server';
import { generateComplianceResult } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { country, modelId } = body;

    if (!country || !modelId) {
      return NextResponse.json({ error: 'country and modelId are required' }, { status: 400 });
    }

    const result = generateComplianceResult(country, modelId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
