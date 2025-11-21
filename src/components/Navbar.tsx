import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-white text-xl font-bold tracking-wider hover:text-secondary transition duration-150">
                📚 Vocab Practice
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className="text-white hover:bg-secondary px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              🎯 Challenge
            </Link>
            <Link 
              href="/dashboard" 
              className="text-white hover:bg-secondary px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              📊 Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}