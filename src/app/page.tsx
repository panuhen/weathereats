'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <article className="prose prose-lg max-w-none">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            AI-Assisted Development Benchmark: WeatherEats
          </h1>
          <div className="text-sm text-gray-500 mb-4">September 6, 2025</div>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Comparative analysis of four AI models building identical Next.js applications 
            from specification to deployment.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <p className="mb-4 leading-relaxed">
            WeatherEats is a Next.js application for discovering restaurants in European cities 
            based on current weather conditions. Four AI models independently implemented the 
            application using identical specifications (<a href="prompt.md" className="text-blue-600 hover:text-blue-800 underline">view spec</a>) to evaluate their software development capabilities.
          </p>
          <p className="mb-4 leading-relaxed">
            This project was selected as an evaluation benchmark because it combines multiple real-world challenges: API integrations, esponsive UI design, and complex business logic - providing a comprehensive test of AI coding capabilities. The complete evaluation methodology and results are documented in the <a href="weathereats_master.md" className="text-blue-600 hover:text-blue-800 underline">master documentation</a>.
          </p>
          <p className="mb-4 leading-relaxed">
            <strong>Core Functionality:</strong> Users select from 25 European cities, view current weather, 
            and receive restaurant recommendations ranked by weather suitability. The application integrates 
            real weather data with restaurant location data to provide contextually relevant suggestions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Technical Requirements</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-3">API Integrations</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>OpenWeatherMap API:</strong> Current weather data for 25 European cities</li>
                <li><strong>OpenStreetMap Overpass API:</strong> Restaurant location and amenity data</li>
                <li><strong>Weather-based ranking:</strong> Algorithm considering temperature, precipitation, wind</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Implementation Requirements</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Frontend:</strong> Next.js with TypeScript and Tailwind CSS</li>
                <li><strong>Security:</strong> Server-side API calls, no exposed credentials</li>
                <li><strong>UX:</strong> Mobile-responsive, loading states, error handling</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Agentic Development Environments Tested</h2>
          <p className="mb-6 leading-relaxed">
            Each development environment worked independently using the same specification document. 
            These tools represent complete development workflows, not just the underlying AI models.
          </p>
          
          <div className="space-y-4">
            <div 
              className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleCard('claude-code')}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Claude Code</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Anthropic&apos;s agentic development CLI
                  </p>
                  <p className="text-sm text-gray-500">Sonnet 4</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-medium text-gray-800">98/100</div>
                  <div className="text-gray-400">
                    {expandedCard === 'claude-code' ? '−' : '+'}
                  </div>
                </div>
              </div>
              
              {expandedCard === 'claude-code' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Code Architecture (25/25) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ Excellent modular structure</div>
                          <div>✅ Complete TypeScript implementation</div>
                          <div>✅ Custom hooks (useLocalStorage, useDebounce)</div>
                          <div>✅ Proper utils and types organization</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Required Components (23/25) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ City Selector: Complete with 25 cities</div>
                          <div>✅ Weather Panel: Full display</div>
                          <div>✅ Radius Slider: 1-10km, debounced</div>
                          <div>⚠️ Restaurant List: Address formatting issue (-2 pts)</div>
                          <div>✅ Preferences Modal: Complete settings</div>
                          <div>✅ Loading States: Skeleton loading</div>
                          <div>✅ Error Handling: Comprehensive</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Functionality (30/30) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ Weather API: OpenWeatherMap integrated</div>
                          <div>✅ Restaurant API: Overpass with rate limiting</div>
                          <div>✅ Weather-Based Ranking: Sophisticated algorithm</div>
                          <div>✅ State Management: Custom hooks</div>
                          <div>✅ Caching: 30-minute weather cache</div>
                          <div>✅ Mobile Responsive: Mobile-first design</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Technical Quality (15/15) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ TypeScript: Comprehensive types</div>
                          <div>✅ Performance: Debounced, cached</div>
                          <div>✅ Code Quality: Clean separation</div>
                          <div>✅ Error Boundaries: Graceful handling</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Security (5/5) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ API key protection: Server-side only</div>
                          <div>✅ No secrets exposed in client code</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-green-50 p-3 rounded">
                      <h4 className="font-medium text-green-800 mb-1">Exceeded Requirements</h4>
                      <div className="space-y-1 text-green-700 text-xs">
                        <div>Accessibility information and enhanced data display</div>
                        <div>Street addresses with detailed restaurant info</div>
                        <div>Weather suitability indicators</div>
                        <div>Professional UI polish beyond specs</div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded">
                      <h4 className="font-medium text-yellow-800 mb-1">Minor Issues</h4>
                      <div className="text-yellow-700 text-xs">
                        • Street address formatting: number appears before street name
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div 
              className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleCard('codex')}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Codex</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    OpenAI&apos;s agentic development extension for VSCode
                  </p>
                  <p className="text-sm text-gray-500">GPT-5 with High Reasoning</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-medium text-gray-800">83/100</div>
                  <div className="text-gray-400">
                    {expandedCard === 'codex' ? '−' : '+'}
                  </div>
                </div>
              </div>
              
              {expandedCard === 'codex' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Code Architecture (20/25) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ Good structure with limitations</div>
                          <div>✅ Basic TypeScript implementation</div>
                          <div>⚠️ Missing dedicated components (-3 pts)</div>
                          <div>⚠️ All UI inline in page.tsx (-2 pts)</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Required Components (18/25) ⚠️</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ City Selector: Complete with 25 cities</div>
                          <div>✅ Weather Panel: Basic display</div>
                          <div>✅ Radius Slider: Functional 1-10km</div>
                          <div>⚠️ Restaurant List: Limited display (-3 pts)</div>
                          <div>⚠️ Preferences: Basic implementation (-2 pts)</div>
                          <div>⚠️ Loading States: Minimal feedback (-2 pts)</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Functionality (25/30) ⚠️</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ Weather API: OpenWeatherMap working</div>
                          <div>✅ Restaurant API: Overpass connected</div>
                          <div>✅ Weather Ranking: Basic algorithm</div>
                          <div>✅ State Management: Good useState/useEffect</div>
                          <div>⚠️ Caching: Limited implementation (-3 pts)</div>
                          <div>⚠️ Advanced features missing (-2 pts)</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Technical Quality (15/15) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ TypeScript: Good type definitions</div>
                          <div>✅ Performance: Debounced radius control</div>
                          <div>✅ Code Quality: Clean, readable code</div>
                          <div>✅ Offline Handling: Online/offline detection</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Security (5/5) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ API key protection: Server-side only</div>
                          <div>✅ No secrets exposed in client code</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-green-50 p-3 rounded">
                      <h4 className="font-medium text-green-800 mb-1">Key Strengths</h4>
                      <div className="space-y-1 text-green-700 text-xs">
                        <div>Zero-shot deployment success - worked immediately</div>
                        <div>Solid TypeScript implementation with good types</div>
                        <div>Functional weather and restaurant integration</div>
                        <div>Clean, readable codebase structure</div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded">
                      <h4 className="font-medium text-yellow-800 mb-1">Areas for Improvement</h4>
                      <div className="space-y-1 text-yellow-700 text-xs">
                        <div>Component modularity (everything in one page.tsx)</div>
                        <div>Enhanced loading states and UX polish</div>
                        <div>More sophisticated preferences system</div>
                        <div>Better visual design and weather icons</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div 
              className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleCard('gemini')}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Gemini</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Google&apos;s agentic development CLI
                  </p>
                  <p className="text-sm text-gray-500">Gemini 2.5 Pro</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-medium text-gray-800">65/100</div>
                  <div className="text-gray-400">
                    {expandedCard === 'gemini' ? '−' : '+'}
                  </div>
                </div>
              </div>
              
              {expandedCard === 'gemini' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Code Architecture (22/25) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ Clean component architecture</div>
                          <div>✅ Good TypeScript structure</div>
                          <div>✅ Proper security implementation</div>
                          <div>⚠️ Some optimization opportunities (-3 pts)</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Required Components (16/25) ⚠️</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ City Selector: Working dropdown</div>
                          <div>✅ Weather Panel: Basic display</div>
                          <div>✅ Radius Slider: Functional (1-10km)</div>
                          <div>⚠️ Restaurant List: Limited data (-4 pts)</div>
                          <div>⚠️ Preferences: Minimal settings (-3 pts)</div>
                          <div>❌ Loading States: Limited feedback (-2 pts)</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Functionality (8/30) ❌</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ Weather API: Working API calls</div>
                          <div>⚠️ Restaurant API: Basic integration (-3 pts)</div>
                          <div>⚠️ Weather Ranking: Simple logic (-3 pts)</div>
                          <div>✅ State Management: Good React handling</div>
                          <div>❌ Caching: Limited implementation (-4 pts)</div>
                          <div>❌ Pagination: Broken, causes duplicates (-7 pts)</div>
                          <div>❌ API Key Management: Erased .env.local (-5 pts)</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Technical Quality (14/15) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ TypeScript: Good type definitions</div>
                          <div>⚠️ Performance: Some opportunities (-1 pt)</div>
                          <div>✅ Code Quality: Clean component structure</div>
                          <div>✅ Error Recovery: Basic error handling</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Security (5/5) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ API key protection: Server-side only</div>
                          <div>✅ No secrets exposed in client code</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-medium text-blue-800 mb-1">Unique Initiative</h4>
                      <div className="space-y-1 text-blue-700 text-xs">
                        <div>Only model to autonomously install shadcn UI library</div>
                        <div>Demonstrated proactive decision-making capabilities</div>
                        <div>Showed architectural thinking beyond basic requirements</div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-3 rounded">
                      <h4 className="font-medium text-red-800 mb-1">Critical Issues</h4>
                      <div className="space-y-1 text-red-700 text-xs">
                        <div>Required manual intervention to fix handleWeatherChange</div>
                        <div>Accidentally erased .env.local API key during development</div>
                        <div>Pagination not working - causes result duplication</div>
                        <div>Poor UX in preferences modal (unintuitive interactions)</div>
                        <div>Plain visual design despite shadcn installation</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div 
              className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleCard('github-copilot')}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">GitHub Copilot</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Microsoft&apos;s integrated coding assistant for VSCode
                  </p>
                  <p className="text-sm text-gray-500">GPT-4.1</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-medium text-gray-800">50/100</div>
                  <div className="text-gray-400">
                    {expandedCard === 'github-copilot' ? '−' : '+'}
                  </div>
                </div>
              </div>
              
              {expandedCard === 'github-copilot' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Code Architecture (15/25) ⚠️</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ Basic structure follows requirements</div>
                          <div>✅ Security properly implemented</div>
                          <div>❌ Missing core components (-5 pts)</div>
                          <div>❌ Incomplete functionality (-3 pts)</div>
                          <div>⚠️ Limited TypeScript definitions (-2 pts)</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Required Components (8/25) ❌</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>❌ City Selector: Missing entirely (-7 pts)</div>
                          <div>✅ Weather Panel: Basic component present</div>
                          <div>✅ Radius Slider: Basic slider implementation</div>
                          <div>⚠️ Restaurant List: Minimal (-3 pts)</div>
                          <div>❌ Preferences Modal: Not implemented (-5 pts)</div>
                          <div>❌ Loading States: No feedback (-2 pts)</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Functionality (10/30) ❌</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>⚠️ Weather API: Basic but limited (-3 pts)</div>
                          <div>⚠️ Restaurant API: Basic structure only (-5 pts)</div>
                          <div>❌ Weather Ranking: Minimal logic (-7 pts)</div>
                          <div>❌ State Management: Very limited (-3 pts)</div>
                          <div>❌ Caching: No implementation (-2 pts)</div>
                          <div>⚠️ Mobile Responsive: Basic responsive layout</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Technical Quality (12/15) ⚠️</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>⚠️ TypeScript: Limited definitions (-1 pt)</div>
                          <div>❌ Performance: No optimization (-2 pts)</div>
                          <div>⚠️ Code Quality: Very basic implementation</div>
                          <div>❌ Error Recovery: Poor error handling</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Security (5/5) ✅</h4>
                        <div className="space-y-1 text-gray-600 ml-2">
                          <div>✅ API key protection: Server-side only</div>
                          <div>✅ No secrets exposed in client code</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-1 gap-4 mt-4">
                    <div className="bg-red-50 p-3 rounded">
                      <h4 className="font-medium text-red-800 mb-1">Critical Development Issues</h4>
                      <div className="space-y-1 text-red-700 text-xs">
                        <div>Required 4 separate manual interventions just to load the page</div>
                        <div>Distance calculator completely non-functional • Restaurant ranking algorithm broken from start</div>
                        <div>Radius slider has no effect on results • Multiple TypeScript compilation errors</div>
                        <div>High maintenance overhead • Basic functionality broken out of the box</div>
                        <div>Fundamental issues with complex requirement interpretation</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Evaluator Insights</h2>
          <p className="mb-6 leading-relaxed text-gray-600">
            Personal observations from hands-on testing and development experience
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Most Impressive: Claude Code (Sonnet 4)</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Claude Code delivered almost zero-shot perfection. Not only did it deploy 
                flawlessly without any manual intervention, but it exceeded expectations with 
                polished UI details and weather suitability indicators that enhanced the user experience beyond 
                the basic requirements. This felt like working with an experienced developer who anticipates needs.
              </p>
            </div>

            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Most Reliable: Codex (GPT-5 High Reasoning)</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Codex proved to be the workhorse, almost zero-shot perfection in terms of reliability. 
                Completely reliable deployment with no surprises. While the UI was visually plain and lacked weather icons, 
                everything functioned exactly as specified. Sometimes boring reliability is exactly what you need in production environments.
              </p>
            </div>

            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Most Surprising: Gemini (2.5 Pro)</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Gemini showed the most initiative by being the only model to install the shadcn UI library on its own, 
                demonstrating autonomous decision-making. However, this was overshadowed by poor execution quality, 
                including accidentally erasing the API key during development and requiring manual fixes to basic functions.
              </p>
            </div>

            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Most Problematic: GitHub Copilot (GPT-4.1)</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                GitHub Copilot required four separate manual interventions just to get a basic page loading. 
                Core features like the distance calculator, restaurant ranking algorithm, and radius slider 
                were completely broken. This highlighted fundamental issues with complex requirement interpretation.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Evaluation Methodology</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Scoring Categories</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Code Architecture (25 points):</strong> Component structure, TypeScript usage</li>
                <li><strong>Required Components (25 points):</strong> UI completeness, functionality</li>
                <li><strong>Functionality (30 points):</strong> API integration, ranking algorithm</li>
                <li><strong>Technical Quality (15 points):</strong> Performance, error handling</li>
                <li><strong>Security (5 points):</strong> API key protection, server-side calls</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Testing Approach</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Zero-shot deployment:</strong> No manual fixes allowed</li>
                <li><strong>Functional testing:</strong> All features must work as specified</li>
                <li><strong>Code review:</strong> LLM-based analysis of implementation quality</li>
                <li><strong>Security audit:</strong> Verification of secure API handling</li>
                <li><strong>User testing:</strong> Real-world usage evaluation</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Each implementation was isolated in its own directory with no code sharing between models. 
            Evaluation focused on production-readiness, not just functional completeness.
          </p>
        </section>


        <section className="mb-10">
          <div className="border-t pt-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-medium text-yellow-800 mb-3">⚠️ Evaluation Disclaimer</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>
                  This evaluation represents one specific use case with particular requirements and preferences. 
                  Your experience may vary significantly based on different project types, coding styles, and workflows.
                </p>
                <div className="flex items-start gap-3">
                  <Image 
                    src="/spider-man.gif" 
                    alt="Spider-Man pointing at Spider-Man meme" 
                    width={120}
                    height={120}
                    className="rounded border flex-shrink-0"
                    unoptimized
                  />
                  <p>
                    <strong>The meta-evaluation paradox:</strong> This evaluation combined human testing with LLM-based code analysis. 
                    So yes, we partially used AI to judge other AIs - including Claude evaluating Claude&apos;s own implementation. 
                    While we tried to balance perspectives, we can&apos;t rule out some bias toward patterns that one particular AI might prefer. 
                    It&apos;s AI evaluation inception all the way down!
                  </p>
                </div>
                <p>
                  AI development tools evolve rapidly. These results reflect model performance at the time of testing and 
                  may not represent current capabilities.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="border-t pt-8 text-center">
            <p className="text-gray-600">
              Questions or comments? <a href="https://www.linkedin.com/in/panuhen/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Reach out</a>.
            </p>
          </div>
        </section>

      </article>
    </div>
  );
}
