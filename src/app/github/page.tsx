import Link from "next/link";

export default function Github() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-foreground hover:text-gray-600 dark:hover:text-gray-300">
                AI Eval
              </Link>
            </div>
            <div className="flex space-x-8">
              <Link href="/about" className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                About
              </Link>
              <Link href="/codex" className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                Codex
              </Link>
              <Link href="/claude-code" className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                Claude Code
              </Link>
              <Link href="/github" className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                Github
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Github</h1>
        </div>
      </main>
    </div>
  );
}