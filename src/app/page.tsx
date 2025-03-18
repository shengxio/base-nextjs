export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome to Base UI
        </h1>
        <p className="text-center mb-4">
          This is a modern Next.js application template with TypeScript, ESLint, Prettier, and Tailwind CSS.
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built with Next.js
          </a>
        </div>
      </div>
    </main>
  );
} 