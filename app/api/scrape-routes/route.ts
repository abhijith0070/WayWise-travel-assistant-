import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/scrape-routes
 * 
 * Scrapes Rome2Rio for route information
 * 
 * Request body:
 * {
 *   "from": "Kochi",
 *   "to": "Goa",
 *   "mode": "Bus" (optional)
 * }
 */

interface RouteResult {
  mode: string;
  duration: string;
  price: string;
  operator?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, mode } = body;

    if (!from || !to) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'Both "from" and "to" parameters are required',
        },
        { status: 400 }
      );
    }

    // Normalize city names for URL (replace spaces with hyphens, lowercase)
    const fromSlug = from.toLowerCase().trim().replace(/\s+/g, '-');
    const toSlug = to.toLowerCase().trim().replace(/\s+/g, '-');
    const url = `https://www.rome2rio.com/s/${fromSlug}/${toSlug}`;

    console.log(`🔍 Scraping routes from: ${url}`);

    // Fetch the page with proper headers to avoid blocking
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000, // 10 second timeout
    });

    const $ = cheerio.load(response.data);
    const routes: RouteResult[] = [];

    // Try multiple selectors as Rome2Rio's HTML structure may vary
    const routeSelectors = [
      '.segment',
      '.route-option',
      '.transport-segment',
      '[data-segment-type]',
      '.timeline-segment',
    ];

    let foundRoutes = false;

    // Iterate through possible selectors
    for (const selector of routeSelectors) {
      const segments = $(selector);
      
      if (segments.length > 0) {
        console.log(`✅ Found ${segments.length} segments using selector: ${selector}`);
        foundRoutes = true;

        segments.each((index, element) => {
          try {
            const $element = $(element);
            
            // Extract transport mode
            let transportMode = 
              $element.find('.segment-icon-name').text().trim() ||
              $element.find('[class*="icon"]').attr('title') ||
              $element.find('[data-mode]').attr('data-mode') ||
              $element.attr('data-segment-type') ||
              'Unknown';

            // Extract duration
            let duration = 
              $element.find('.duration').text().trim() ||
              $element.find('[class*="duration"]').text().trim() ||
              $element.find('.time').text().trim() ||
              'N/A';

            // Extract price
            let price = 
              $element.find('.price').text().trim() ||
              $element.find('[class*="price"]').text().trim() ||
              $element.find('.cost').text().trim() ||
              'Price varies';

            // Extract operator (optional)
            let operator =
              $element.find('.operator-name').text().trim() ||
              $element.find('[class*="operator"]').text().trim() ||
              '';

            // Clean up and normalize data
            transportMode = normalizeMode(transportMode);
            duration = cleanDuration(duration);
            price = cleanPrice(price);

            if (transportMode && transportMode !== 'Unknown') {
              routes.push({
                mode: transportMode,
                duration: duration,
                price: price,
                ...(operator && { operator }),
              });
            }
          } catch (err) {
            console.error('Error parsing segment:', err);
          }
        });

        if (routes.length > 0) {
          break; // Stop if we found routes
        }
      }
    }

    // If no routes found with specific selectors, try generic approach
    if (!foundRoutes || routes.length === 0) {
      console.log('⚠️ No routes found with specific selectors, trying generic approach...');
      
      // Look for any text that might indicate transport modes
      const bodyText = $('body').text();
      const hasContent = bodyText.length > 1000;

      if (hasContent) {
        // Return a fallback message
        return NextResponse.json({
          success: false,
          error: 'Unable to parse routes',
          details: 'Rome2Rio structure may have changed. Please use the dummy data fallback.',
          scraped: false,
          url: url,
        }, { status: 404 });
      }
    }

    // Filter by mode if specified
    let filteredRoutes = routes;
    if (mode && mode !== 'all' && mode !== 'AUTO') {
      const normalizedMode = normalizeMode(mode);
      filteredRoutes = routes.filter(route => 
        route.mode.toLowerCase().includes(normalizedMode.toLowerCase())
      );
    }

    // Remove duplicates
    const uniqueRoutes = Array.from(
      new Map(filteredRoutes.map(r => [`${r.mode}-${r.duration}-${r.price}`, r])).values()
    );

    console.log(`✅ Successfully scraped ${uniqueRoutes.length} routes`);

    return NextResponse.json({
      success: true,
      count: uniqueRoutes.length,
      routes: uniqueRoutes,
      scraped: true,
      source: 'rome2rio',
      url: url,
    });

  } catch (error: any) {
    console.error('❌ Scraping error:', error.message);

    // Return fallback error with helpful message
    return NextResponse.json(
      {
        success: false,
        error: 'Scraping failed',
        details: error.message || 'Unable to fetch data from Rome2Rio',
        scraped: false,
        fallback: 'Use dummy data instead',
      },
      { status: 500 }
    );
  }
}

// Helper function to normalize transport mode names
function normalizeMode(mode: string): string {
  mode = mode.toLowerCase().trim();
  
  if (mode.includes('plane') || mode.includes('flight') || mode.includes('fly')) return 'Flight';
  if (mode.includes('train') || mode.includes('rail')) return 'Train';
  if (mode.includes('bus') || mode.includes('coach')) return 'Bus';
  if (mode.includes('car') || mode.includes('drive')) return 'Car';
  if (mode.includes('taxi') || mode.includes('cab')) return 'Taxi';
  if (mode.includes('ferry') || mode.includes('boat')) return 'Ferry';
  if (mode.includes('walk')) return 'Walk';
  
  // Capitalize first letter
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

// Helper function to clean duration string
function cleanDuration(duration: string): string {
  duration = duration.trim();
  
  // If already formatted nicely, return as is
  if (duration.match(/\d+h|\d+m|\d+\s+(hour|min)/i)) {
    return duration;
  }
  
  // Extract numbers and convert to hours/minutes format
  const hours = duration.match(/(\d+)\s*h/i);
  const minutes = duration.match(/(\d+)\s*m/i);
  
  if (hours || minutes) {
    const h = hours ? `${hours[1]}h` : '';
    const m = minutes ? ` ${minutes[1]}m` : '';
    return (h + m).trim() || duration;
  }
  
  return duration || 'N/A';
}

// Helper function to clean price string
function cleanPrice(price: string): string {
  price = price.trim();
  
  // Remove extra whitespace
  price = price.replace(/\s+/g, ' ');
  
  // If price is empty or just symbols, return default
  if (!price || price === '-' || price === '–') {
    return 'Price varies';
  }
  
  return price;
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
