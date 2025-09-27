import React from "react";
import CountingGame from "@/components/CountingGame";

export default function CountItemsPage() {
  const handleComplete = (results: any) => {
    console.log("Game finished:", results);
    // You can redirect to Awards, show results screen, etc.
  };

  return (
    <div className="min-h-screen bg-[#eef3fb] font-['Press_Start_2P']">
      <header className="bg-[#2196f3] text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/arcade-mascot.png" alt="Learning Land Mascot" className="h-10" />
          <span>Learning Land</span>
        </div>
        <nav>
          <a href="/homepage.html" className="mr-4">🏠 Home</a>
          <a href="/reading.html" className="mr-4">📖 Reading</a>
          <a href="/writing.html" className="mr-4">✏️ Writing</a>
          <a href="/math.html" className="mr-4 underline">🧮 Math</a>
          <a href="/awards.html">🏆 Awards</a>
        </nav>
      </header>

      <main className="p-8">
        <h1 className="text-center text-2xl mb-8">🧮 Count the Items</h1>
        <CountingGame onGameComplete={handleComplete} />
      </main>

      <footer className="text-center text-sm text-gray-500 p-4">
        &copy; 2025 Learning Land. All rights reserved.
      </footer>
    </div>
  );
}
