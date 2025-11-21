import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vocabulary Practice App',
  description: 'Full-stack application for practicing English vocabulary.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-gray-100 min-h-screen'}>
        <Navbar /> {}
        <main className="container mx-auto">
            {children}
        </main>
      </body>
    </html>
  );
}

// import './globals.css';
// import { Inter } from 'next/font/google';
// import Header from '@/components/Header';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Daily Vocab',
//   description: 'Improve your vocabulary daily',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-gray-100 min-h-screen`}>
//         <Header />
//         <main className="py-8">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }
