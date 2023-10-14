import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow bg-gray-200 p-10">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Dobrodošli na Virdzinija B2B Portal za Narudžbine</h1>
          <p className="text-lg mb-8">Vaše jedinstveno rešenje za narudžbine artikala u velikim količinama.</p>
          <a href="/shop" className="bg-blue-500 text-white px-4 py-2 rounded">Pregledajte Proizvode</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 p-4">
        <div className="container mx-auto">
          <div className="text-center text-white">
            © 2023 Virdzinija B2B Portal, Sva prava zadržana
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
