export async function GET(request) {
  try {
    // Get the search params from the request
    const { searchParams } = new URL(request.url);
    // Build the backend URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const backendUrl = new URL('/api/blogs', baseUrl);
    // Copy all search parameters to the backend URL
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });
    // Make the request to the backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    const data = await response.json();
    // Return the response from the backend
    return Response.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to fetch blogs',
        error: error.message,
      },
      { status: 500 }
    );
  }
} 