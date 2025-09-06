export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <article className="prose prose-lg max-w-none">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            The WeatherEats Challenge
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Four AI models, one complex app, and the question that matters: 
            which artificial intelligence can actually build software that works?
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">The Experiment</h2>
          <p className="mb-4 leading-relaxed">
            In early 2025, we set out to answer a fundamental question about AI-assisted development: 
            when given identical requirements, how do different AI models perform at building 
            real-world applications? Not toy examples or simple scripts, but a genuinely complex 
            web application with multiple APIs, sophisticated algorithms, and production-grade requirements.
          </p>
          <p className="mb-4 leading-relaxed">
            The challenge was WeatherEats—a Next.js application that helps users discover restaurants 
            in European cities based on current weather conditions. Simple concept, complex execution. 
            Weather API integration, restaurant data from OpenStreetMap, algorithmic ranking based on 
            meteorological conditions, user preferences, caching, error handling, mobile responsiveness, 
            and TypeScript throughout.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">The Contestants</h2>
          <p className="mb-6 leading-relaxed">
            Four prominent AI models entered the arena, each tasked with building their implementation 
            from scratch using the same detailed specification:
          </p>
          
          <div className="space-y-6 ml-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Claude Code</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                Anthropic&apos;s latest coding-focused model, designed specifically for software development tasks.
              </p>
              <p className="text-sm text-gray-600 italic">
                Accessed via CLI • Sonnet 4 • January 2025
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Codex</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                OpenAI&apos;s code generation model, the engine behind GitHub Copilot and a pioneer in AI-assisted programming.
              </p>
              <p className="text-sm text-gray-600 italic">
                Accessed via VSCode extension • GPT-5 with High Reasoning • January 2025
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Gemini</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                Google&apos;s multimodal AI model, bringing considerable computational resources to the development challenge.
              </p>
              <p className="text-sm text-gray-600 italic">
                Accessed via CLI • Gemini 2.5 Pro • January 2025
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">GitHub Copilot</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                Microsoft&apos;s integration of GPT technology specifically optimized for development workflows.
              </p>
              <p className="text-sm text-gray-600 italic">
                Accessed via VSCode chat • GPT-4.1 • January 2025
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">The Rules of Engagement</h2>
          <p className="mb-4 leading-relaxed">
            Each AI model worked in complete isolation, restricted to their own folder within the codebase. 
            No sharing of code, no collaboration, no second chances. They received identical requirements: 
            a comprehensive specification document detailing every aspect of the application from security 
            requirements to UI components to algorithmic complexity.
          </p>
          <p className="mb-4 leading-relaxed">
            The evaluation would be ruthless. Automated testing for functional requirements, manual review 
            for code quality, and real-world deployment testing. Security was non-negotiable—any model 
            exposing API keys would automatically fail. Performance mattered. User experience counted. 
            The weather-based restaurant ranking algorithm had to be mathematically sound and implemented 
            as a separate, testable utility function.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">What We Discovered</h2>
          <p className="mb-4 leading-relaxed">
            The results were more revealing than anticipated. This wasn&apos;t just about which model could 
            write the most lines of code—it was about understanding requirements, architectural thinking, 
            edge case handling, and the subtle art of building software that humans actually want to use.
          </p>
          <p className="mb-4 leading-relaxed">
            Two models achieved what we call &ldquo;zero-shot success&rdquo;&mdash;their implementations worked flawlessly 
            from the first deployment without any manual intervention. Others required debugging, 
            missing core features, or fundamentally misunderstood the requirements. One model went 
            beyond the specification entirely, implementing accessibility features and enhanced data 
            display that wasn&apos;t even requested.
          </p>
          <p className="mb-4 leading-relaxed">
            The differences in approach were striking. Some models focused on comprehensive TypeScript 
            architecture with custom hooks and modular components. Others took a monolithic approach, 
            cramming functionality into single files. The treatment of error handling, loading states, 
            and user experience varied dramatically—revealing different philosophies about what 
            constitutes &ldquo;complete&rdquo; software.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Beyond the Code</h2>
          <p className="mb-4 leading-relaxed">
            This evaluation revealed something fundamental about AI-assisted development in 2025. 
            The gap between competent code generation and production-ready software development 
            remains significant. Understanding requirements, making architectural decisions, 
            handling edge cases, and creating genuinely useful user experiences—these remain 
            distinctly challenging for artificial intelligence.
          </p>
          <p className="mb-4 leading-relaxed">
            Yet the results also demonstrate remarkable progress. The best-performing models didn&apos;t 
            just follow instructions&mdash;they demonstrated something approaching software engineering 
            judgment, making decisions about code organization, user experience, and even going 
            beyond requirements when it served the application&apos;s purpose.
          </p>
        </section>

        <nav className="border-t pt-8 mt-12">
          <h2 className="text-xl font-semibold mb-6">Explore the Results</h2>
          <div className="space-y-3">
            <div>
              <a href="/claude-code" className="text-lg font-medium text-blue-600 hover:text-blue-800 underline">
                Claude Code Implementation
              </a>
              <span className="text-gray-600 ml-2">— The comprehensive approach</span>
            </div>
            <div>
              <a href="/codex" className="text-lg font-medium text-blue-600 hover:text-blue-800 underline">
                Codex Implementation  
              </a>
              <span className="text-gray-600 ml-2">— Solid and reliable</span>
            </div>
            <div>
              <a href="/gemini" className="text-lg font-medium text-blue-600 hover:text-blue-800 underline">
                Gemini Implementation
              </a>
              <span className="text-gray-600 ml-2">— Initiative with execution challenges</span>
            </div>
            <div>
              <a href="/github-gpt" className="text-lg font-medium text-blue-600 hover:text-blue-800 underline">
                GitHub Copilot Implementation
              </a>
              <span className="text-gray-600 ml-2">— The incomplete attempt</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3">
              <strong>For the full analysis:</strong>
            </p>
            <div className="space-y-2">
              <div>
                <a href="/FINAL-EVAL.md" className="font-medium text-blue-600 hover:text-blue-800 underline">
                  Complete Evaluation Report
                </a>
                <span className="text-gray-600 ml-2">— Detailed scoring and technical analysis</span>
              </div>
              <div>
                <a href="/EVALUATOR-COMMENTS.md" className="font-medium text-blue-600 hover:text-blue-800 underline">
                  Hands-On Testing Notes
                </a>
                <span className="text-gray-600 ml-2">— Real-world development observations</span>
              </div>
            </div>
          </div>
        </nav>
      </article>
    </div>
  );
}
