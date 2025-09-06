import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-foreground hover:text-gray-600 dark:hover:text-gray-300">
              WeatherEats
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link href="/" className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              About
            </Link>
            <Link href="/codex" className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Codex
            </Link>
            <Link href="/claude-code" className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Claude Code
            </Link>
            <Link href="/gemini" className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Gemini
            </Link>
            <Link href="/github-gpt" className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              GitHub GPT
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}