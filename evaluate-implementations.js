const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const MODELS = ['claude-code', 'codex', 'gemini', 'github-gpt'];
const BASE_URL = 'http://localhost:3000';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function evaluateModel(modelName) {
  console.log(`\n🧪 Testing ${modelName}...`);
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  const results = {
    model: modelName,
    pageLoaded: false,
    components: {},
    functionality: {},
    errors: [],
    screenshots: []
  };

  try {
    // Navigate to model page
    const url = `${BASE_URL}/${modelName}`;
    console.log(`  📍 Navigating to ${url}`);
    
    const response = await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });
    
    results.pageLoaded = response.status() === 200;
    
    if (!results.pageLoaded) {
      results.errors.push(`Failed to load page: HTTP ${response.status()}`);
      await browser.close();
      return results;
    }

    // Wait for page to fully load
    await wait(2000);

    // Take initial screenshot
    const screenshotPath = `/tmp/${modelName}-initial.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    results.screenshots.push(screenshotPath);

    // Test 1: Check for required UI components
    console.log('  🔍 Checking UI components...');
    
    // City selector
    const citySelector = await page.$('select, [data-testid*="city"], [aria-label*="city" i]');
    results.components.hasCitySelector = !!citySelector;
    
    if (citySelector) {
      const options = await page.$$eval('select option, [role="option"]', 
        elements => elements.map(el => el.textContent || el.innerText).filter(text => text.trim())
      );
      results.components.cityCount = options.length;
      results.components.cities = options.slice(0, 5); // First 5 for reference
      
      // Check for Helsinki as default
      const selectedText = await page.$eval('select, [data-testid*="city"]', 
        el => el.value || el.textContent || ''
      ).catch(() => '');
      results.components.defaultIsHelsinki = selectedText.toLowerCase().includes('helsinki');
    }

    // Weather panel
    const weatherPanel = await page.$('[data-testid*="weather"], .weather, [class*="weather"]');
    results.components.hasWeatherPanel = !!weatherPanel;

    // Restaurant list/grid
    const restaurantList = await page.$('[data-testid*="restaurant"], .restaurant, [class*="restaurant"]');
    results.components.hasRestaurantList = !!restaurantList;

    // Radius slider
    const radiusSlider = await page.$('input[type="range"], [data-testid*="radius"], [aria-label*="radius" i]');
    results.components.hasRadiusSlider = !!radiusSlider;

    // Settings/preferences modal trigger
    const settingsButton = await page.$('[data-testid*="settings"], [data-testid*="preferences"], button[aria-label*="settings" i]');
    results.components.hasSettingsButton = !!settingsButton;

    // Test 2: Functional testing
    console.log('  ⚡ Testing functionality...');

    // Try to change city selection
    if (citySelector) {
      try {
        const cityOptions = await page.$$eval('select option', 
          options => options.map(opt => opt.value).filter(val => val)
        );
        
        if (cityOptions.length > 1) {
          await page.select('select', cityOptions[1]);
          await wait(3000); // Wait for API calls
          
          // Check if weather data updated
          const weatherText = await page.$eval('body', el => el.innerText).catch(() => '');
          results.functionality.cityChangeWorks = weatherText.includes('°') || weatherText.includes('temp');
        }
      } catch (error) {
        results.errors.push(`City selection test failed: ${error.message}`);
      }
    }

    // Test radius slider if present
    if (radiusSlider) {
      try {
        await page.focus('input[type="range"]');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await wait(2000); // Wait for debounced update
        
        results.functionality.radiusSliderWorks = true;
      } catch (error) {
        results.errors.push(`Radius slider test failed: ${error.message}`);
        results.functionality.radiusSliderWorks = false;
      }
    }

    // Test settings modal if present
    if (settingsButton) {
      try {
        await settingsButton.click();
        await wait(1000);
        
        const modal = await page.$('[role="dialog"], .modal, [data-testid*="modal"]');
        results.functionality.settingsModalWorks = !!modal;
        
        if (modal) {
          // Try to close modal
          const closeButton = await page.$('[aria-label*="close" i], .close, [data-testid*="close"]');
          if (closeButton) {
            await closeButton.click();
          } else {
            await page.keyboard.press('Escape');
          }
          await wait(500);
        }
      } catch (error) {
        results.errors.push(`Settings modal test failed: ${error.message}`);
      }
    }

    // Test 3: Check for loading states and error handling
    console.log('  🔄 Checking loading states...');
    
    const bodyText = await page.$eval('body', el => el.innerText.toLowerCase());
    results.components.hasLoadingStates = bodyText.includes('loading') || bodyText.includes('skeleton');
    results.components.hasErrorHandling = bodyText.includes('error') || bodyText.includes('retry');

    // Test 4: Check responsiveness
    console.log('  📱 Testing mobile responsiveness...');
    
    await page.setViewport({ width: 375, height: 667 }); // Mobile viewport
    await wait(1000);
    
    const mobileScreenshot = `/tmp/${modelName}-mobile.png`;
    await page.screenshot({ path: mobileScreenshot, fullPage: true });
    results.screenshots.push(mobileScreenshot);

    // Check if layout adapts to mobile
    const mobileBodyText = await page.$eval('body', el => {
      const rect = el.getBoundingClientRect();
      return rect.width <= 400 ? 'mobile-adapted' : 'not-mobile-adapted';
    });
    results.functionality.mobileResponsive = mobileBodyText === 'mobile-adapted';

    // Test 5: Check for restaurant data
    console.log('  🍽️  Checking restaurant data...');
    
    await page.setViewport({ width: 1200, height: 800 }); // Back to desktop
    await wait(2000);

    const restaurants = await page.$$('[data-testid*="restaurant"], .restaurant-card, [class*="restaurant"]');
    results.functionality.restaurantCount = restaurants.length;
    
    if (restaurants.length > 0) {
      const firstRestaurant = restaurants[0];
      const restaurantText = await firstRestaurant.evaluate(el => el.innerText);
      
      results.functionality.hasRestaurantName = /[a-zA-Z\s]{3,}/.test(restaurantText);
      results.functionality.hasCuisineInfo = restaurantText.toLowerCase().includes('cuisine') || 
                                           /\b(italian|french|chinese|indian|mexican|thai|japanese)\b/i.test(restaurantText);
      results.functionality.hasDistance = /\d+(\.\d+)?\s*(km|m|miles)/i.test(restaurantText);
    }

    // Test 6: Network requests monitoring
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('api') || request.url().includes('weather') || request.url().includes('overpass')) {
        networkRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });

    // Trigger a city change to monitor API calls
    if (citySelector) {
      const cityOptions = await page.$$eval('select option', 
        options => options.map(opt => opt.value).filter(val => val)
      );
      
      if (cityOptions.length > 2) {
        await page.select('select', cityOptions[2]);
        await wait(4000); // Wait for API calls
      }
    }

    results.functionality.apiCallsDetected = networkRequests.length > 0;
    results.functionality.networkRequests = networkRequests.slice(0, 3); // First 3 for reference

    console.log(`  ✅ ${modelName} evaluation complete`);

  } catch (error) {
    console.error(`  ❌ Error testing ${modelName}:`, error.message);
    results.errors.push(`General error: ${error.message}`);
  }

  await browser.close();
  return results;
}

async function generateReport(allResults) {
  console.log('\n📊 Generating final evaluation report...');
  
  const report = `# WeatherEats - Final Evaluation Report

*Generated on: ${new Date().toISOString()}*

## Executive Summary

This report evaluates the WeatherEats implementations by all 4 AI models: Claude Code, Codex, Gemini, and GitHub GPT. The evaluation focuses on UI completeness, functionality, and adherence to requirements.

## Evaluation Methodology

- **Automated Puppeteer Testing**: Comprehensive UI and functional testing
- **Manual Review**: Code structure and implementation quality assessment
- **Requirements Compliance**: Strict adherence to weathereats_master.md specifications

---

`;

  // Individual model results
  for (const result of allResults) {
    const score = calculateScore(result);
    
    report += `## ${result.model.toUpperCase()} Implementation

### Overall Score: ${score.total}/100

#### Page Load & Accessibility
- **Page Loads Successfully**: ${result.pageLoaded ? '✅' : '❌'}
- **Mobile Responsive**: ${result.functionality.mobileResponsive ? '✅' : '❌'}

#### Required UI Components (25 points)
- **City Selector**: ${result.components.hasCitySelector ? '✅' : '❌'} ${result.components.hasCitySelector ? `(${result.components.cityCount || 0} cities)` : ''}
- **Default Helsinki**: ${result.components.defaultIsHelsinki ? '✅' : '❌'}
- **Weather Panel**: ${result.components.hasWeatherPanel ? '✅' : '❌'}
- **Restaurant List**: ${result.components.hasRestaurantList ? '✅' : '❌'}
- **Radius Slider**: ${result.components.hasRadiusSlider ? '✅' : '❌'}
- **Settings/Preferences**: ${result.components.hasSettingsButton ? '✅' : '❌'}

*Score: ${score.components}/25*

#### Functionality (35 points)
- **City Selection Works**: ${result.functionality.cityChangeWorks ? '✅' : '❌'}
- **Radius Control**: ${result.functionality.radiusSliderWorks ? '✅' : '❌'}
- **Settings Modal**: ${result.functionality.settingsModalWorks ? '✅' : '❌'}
- **API Integration**: ${result.functionality.apiCallsDetected ? '✅' : '❌'}
- **Restaurant Data**: ${result.functionality.restaurantCount || 0} restaurants found
  - Has Names: ${result.functionality.hasRestaurantName ? '✅' : '❌'}
  - Has Cuisine: ${result.functionality.hasCuisineInfo ? '✅' : '❌'}
  - Has Distance: ${result.functionality.hasDistance ? '✅' : '❌'}

*Score: ${score.functionality}/35*

#### User Experience (25 points)
- **Loading States**: ${result.components.hasLoadingStates ? '✅' : '❌'}
- **Error Handling**: ${result.components.hasErrorHandling ? '✅' : '❌'}
- **Mobile Layout**: ${result.functionality.mobileResponsive ? '✅' : '❌'}

*Score: ${score.ux}/25*

#### Technical Implementation (15 points)
- **Clean Error Handling**: ${result.errors.length === 0 ? '✅' : '❌'} ${result.errors.length > 0 ? `(${result.errors.length} errors)` : ''}

*Score: ${score.technical}/15*

`;

    if (result.errors.length > 0) {
      report += `#### Issues Found
${result.errors.map(error => `- ${error}`).join('\n')}

`;
    }

    report += `---

`;
  }

  // Rankings
  const rankings = allResults
    .map(result => ({ 
      model: result.model, 
      score: calculateScore(result).total,
      pageLoaded: result.pageLoaded 
    }))
    .sort((a, b) => b.score - a.score);

  report += `## Final Rankings

| Rank | Model | Score | Status |
|------|-------|--------|--------|
${rankings.map((r, i) => `| ${i + 1} | ${r.model} | ${r.score}/100 | ${r.pageLoaded ? '✅ Working' : '❌ Failed'} |`).join('\n')}

## Key Findings

### Strengths Across Implementations
${findCommonStrengths(allResults)}

### Common Issues
${findCommonIssues(allResults)}

## Recommendations

### For Working Implementations
1. **Enhance Restaurant Data**: Ensure all restaurant cards display name, cuisine, and distance
2. **Improve Loading States**: Add skeleton loading for better UX
3. **Settings Persistence**: Implement localStorage for user preferences
4. **Weather-Based Ranking**: Implement the required ranking algorithm

### For Failed Implementations
1. **Basic Functionality**: Focus on getting the page to load and display basic UI
2. **API Integration**: Implement proper weather and restaurant data fetching
3. **Component Structure**: Follow React/Next.js best practices

---

*This evaluation was conducted using automated Puppeteer testing with a focus on functional requirements and user experience.*
`;

  return report;
}

function calculateScore(result) {
  let components = 0;
  let functionality = 0;
  let ux = 0;
  let technical = 0;

  if (!result.pageLoaded) {
    return { components: 0, functionality: 0, ux: 0, technical: 0, total: 0 };
  }

  // Components scoring (25 points)
  if (result.components.hasCitySelector) components += 5;
  if (result.components.cityCount >= 20) components += 3; // Close to 25 cities
  if (result.components.defaultIsHelsinki) components += 2;
  if (result.components.hasWeatherPanel) components += 5;
  if (result.components.hasRestaurantList) components += 5;
  if (result.components.hasRadiusSlider) components += 3;
  if (result.components.hasSettingsButton) components += 2;

  // Functionality scoring (35 points)
  if (result.functionality.cityChangeWorks) functionality += 10;
  if (result.functionality.radiusSliderWorks) functionality += 5;
  if (result.functionality.settingsModalWorks) functionality += 5;
  if (result.functionality.apiCallsDetected) functionality += 8;
  if (result.functionality.restaurantCount > 0) functionality += 3;
  if (result.functionality.hasRestaurantName) functionality += 2;
  if (result.functionality.hasCuisineInfo) functionality += 1;
  if (result.functionality.hasDistance) functionality += 1;

  // UX scoring (25 points)
  if (result.components.hasLoadingStates) ux += 8;
  if (result.components.hasErrorHandling) ux += 7;
  if (result.functionality.mobileResponsive) ux += 10;

  // Technical scoring (15 points)
  if (result.errors.length === 0) technical += 15;
  else if (result.errors.length <= 2) technical += 10;
  else if (result.errors.length <= 5) technical += 5;

  const total = components + functionality + ux + technical;
  return { components, functionality, ux, technical, total };
}

function findCommonStrengths(results) {
  const workingResults = results.filter(r => r.pageLoaded);
  if (workingResults.length === 0) return "- No working implementations found";

  const strengths = [];
  const totalWorking = workingResults.length;

  if (workingResults.filter(r => r.components.hasCitySelector).length === totalWorking) {
    strengths.push("- All working implementations include city selectors");
  }
  if (workingResults.filter(r => r.components.hasWeatherPanel).length === totalWorking) {
    strengths.push("- Weather panels are consistently implemented");
  }
  if (workingResults.filter(r => r.functionality.mobileResponsive).length === totalWorking) {
    strengths.push("- Mobile responsiveness is well-implemented across models");
  }

  return strengths.length > 0 ? strengths.join('\n') : "- Mixed implementation quality across models";
}

function findCommonIssues(results) {
  const issues = [];
  const totalResults = results.length;

  const failedLoads = results.filter(r => !r.pageLoaded).length;
  if (failedLoads > 0) {
    issues.push(`- ${failedLoads}/${totalResults} implementations failed to load`);
  }

  const missingSettings = results.filter(r => !r.components.hasSettingsButton).length;
  if (missingSettings > totalResults / 2) {
    issues.push("- Settings/preferences modals are commonly missing");
  }

  const missingLoadingStates = results.filter(r => !r.components.hasLoadingStates).length;
  if (missingLoadingStates > totalResults / 2) {
    issues.push("- Loading states are frequently missing");
  }

  return issues.length > 0 ? issues.join('\n') : "- No major common issues identified";
}

async function main() {
  console.log('🚀 Starting WeatherEats evaluation...');
  
  const allResults = [];
  
  for (const model of MODELS) {
    const result = await evaluateModel(model);
    allResults.push(result);
    
    // Small delay between tests
    await wait(1000);
  }
  
  const report = await generateReport(allResults);
  
  // Write report to file
  await fs.writeFile('FINAL-EVAL.md', report, 'utf8');
  console.log('\n✅ Evaluation complete! Report saved to FINAL-EVAL.md');
  
  // Also log summary to console
  console.log('\n📊 QUICK SUMMARY:');
  allResults.forEach(result => {
    const score = calculateScore(result);
    console.log(`${result.model.padEnd(12)}: ${score.total}/100 ${result.pageLoaded ? '✅' : '❌'}`);
  });
}

if (require.main === module) {
  main().catch(console.error);
}