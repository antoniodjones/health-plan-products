import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Products & Benefits Platform
        </h1>
        <p className="mb-8 text-center text-lg">
          AI-Native Products & Benefits Platform for Healthcare Payers
        </p>

        <div className="mb-32 grid gap-6 text-center lg:mb-0 lg:grid-cols-3 lg:text-left">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🤖 AI-Driven
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Create products in 5-10 minutes using natural language conversations with AI agents.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🎨 Visual Builder
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Drag-and-drop interface with maximum control for actuaries and power users.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🧙 Guided Wizard
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Step-by-step guided workflow perfect for first-time users and product managers.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-16 rounded-lg border border-gray-300 bg-gray-50 p-8 dark:border-neutral-700 dark:bg-neutral-800/30">
          <h3 className="mb-4 text-xl font-semibold">🚀 Quick Start</h3>
          <ol className="list-inside list-decimal space-y-2 text-sm">
            <li>Install dependencies: <code className="rounded bg-gray-200 px-2 py-1 dark:bg-neutral-700">npm install</code></li>
            <li>Start Docker: <code className="rounded bg-gray-200 px-2 py-1 dark:bg-neutral-700">docker-compose up -d</code></li>
            <li>Push database schema: <code className="rounded bg-gray-200 px-2 py-1 dark:bg-neutral-700">npx prisma db push</code></li>
            <li>You're ready to build!</li>
          </ol>
        </div>
      </div>
    </main>
  )
}

