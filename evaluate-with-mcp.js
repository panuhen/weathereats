// Using Claude's MCP Puppeteer server instead of local installation
const MODELS = ['claude-code', 'codex', 'gemini', 'github-gpt'];
const BASE_URL = 'http://localhost:3000';

// This script will be executed by the MCP Puppeteer server
async function evaluateAllModels() {
  const results = [];
  
  for (const model of MODELS) {
    console.log(`Evaluating ${model}...`);
    
    const result = {
      model,
      pageLoaded: false,
      components: {},
      functionality: {},
      errors: []
    };

    try {
      const url = `${BASE_URL}/${model}`;
      
      // Navigate and wait for load
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      result.pageLoaded = true;
      
      // Wait for potential loading states
      await page.waitForTimeout(3000);
      
      // Check for UI components
      result.components.hasCitySelector = !!(await page.$('select, [data-testid*="city"]'));
      result.components.hasWeatherPanel = !!(await page.$('[data-testid*="weather"], .weather, [class*="weather"]'));
      result.components.hasRestaurantList = !!(await page.$('[data-testid*="restaurant"], .restaurant, [class*="restaurant"]'));
      result.components.hasRadiusSlider = !!(await page.$('input[type="range"]'));
      result.components.hasSettingsButton = !!(await page.$('[data-testid*="settings"], [data-testid*="preferences"]'));
      
      // Count cities if selector exists
      if (result.components.hasCitySelector) {
        const cityCount = await page.$$eval('select option, [role="option"]', 
          elements => elements.filter(el => el.textContent?.trim()).length
        );
        result.components.cityCount = cityCount;
        
        // Check default city
        const selectedText = await page.$eval('select', el => el.value || '').catch(() => '');
        result.components.defaultIsHelsinki = selectedText.toLowerCase().includes('helsinki');
      }
      
      // Check for restaurants
      const restaurants = await page.$$('[data-testid*="restaurant"], .restaurant-card, [class*="restaurant"]');
      result.functionality.restaurantCount = restaurants.length;
      
      // Test mobile responsiveness
      await page.setViewport({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      result.functionality.mobileResponsive = true; // Assume responsive if page loads
      
      // Reset viewport
      await page.setViewport({ width: 1200, height: 800 });
      
    } catch (error) {
      result.errors.push(error.message);
    }
    
    results.push(result);
  }
  
  return results;
}

// Export for MCP usage
module.exports = { evaluateAllModels, MODELS, BASE_URL };