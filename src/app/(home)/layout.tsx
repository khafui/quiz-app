import Navbar from "@/components/navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          // <main >
          <main className="mx-auto p-6 px-4">
          <Navbar />
            <div className="max-w-7xl mx-auto p-4 justify-between items-center">
                {children}
            </div>
          </main>

  );
}
