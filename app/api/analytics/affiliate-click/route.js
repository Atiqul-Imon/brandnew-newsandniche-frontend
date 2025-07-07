import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { program, product, region, linkType, timestamp, userAgent, referrer } = body;

    // Validate required fields
    if (!program || !product || !region) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the affiliate click (in production, you'd send this to your analytics service)
    console.log('Affiliate Click:', {
      program,
      product,
      region,
      linkType,
      timestamp,
      userAgent,
      referrer,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    // In a real implementation, you would:
    // 1. Send to Google Analytics 4
    // 2. Store in your database
    // 3. Send to external analytics services
    // 4. Track conversion events

    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Affiliate click tracked successfully',
      data: {
        program,
        product,
        region,
        linkType,
        timestamp
      }
    });

  } catch (error) {
    console.error('Error tracking affiliate click:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Affiliate click tracking endpoint is active',
    usage: 'Send POST request with program, product, region, linkType, timestamp, userAgent, and referrer'
  });
} 