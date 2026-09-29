/**
 * Safe API response parser for ContentMind client-side requests
 * Handles JSON parsing with proper error handling and content-type validation
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public contentType?: string,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Safely parse API response with content-type and status validation
 * @param response - Fetch API Response object
 * @returns Parsed JSON data
 * @throws ApiError with details about the failure
 */
export async function parseApiResponse<T = any>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const endpoint = response.url;

  // Check if response is OK (2xx status)
  if (!response.ok) {
    // Try to parse error as JSON if content-type suggests it
    if (contentType.includes('application/json')) {
      try {
        const errorBody = await response.json();
        throw new ApiError(
          errorBody?.error || errorBody?.message || `Request failed with status ${response.status}`,
          response.status,
          contentType,
          endpoint
        );
      } catch (parseError) {
        // If JSON parsing fails, fall through to generic error
      }
    }

    // Generic HTTP error
    throw new ApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
      contentType,
      endpoint
    );
  }

  // Validate content-type before parsing as JSON
  if (!contentType.includes('application/json')) {
    throw new ApiError(
      `Expected JSON response but received ${contentType || 'unknown content type'}. The API may have returned an error page.`,
      response.status,
      contentType,
      endpoint
    );
  }

  // Safe JSON parsing
  try {
    return await response.json();
  } catch (error) {
    throw new ApiError(
      'Failed to parse JSON response',
      response.status,
      contentType,
      endpoint
    );
  }
}

/**
 * Safe fetch wrapper with automatic JSON parsing
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Parsed JSON data
 */
export async function fetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  return parseApiResponse<T>(response);
}
