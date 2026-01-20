import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-red-600 mb-4 opacity-10">404</h1>
        <h2 className="text-4xl font-bold text-slate-900 mb-6 -mt-20">Page Not Found</h2>
        <p className="text-lg text-slate-600 max-w-md mx-auto mb-10">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg text-base font-semibold bg-red-600 text-white hover:bg-red-700 h-12 px-8 transition-all hover:shadow-lg"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
