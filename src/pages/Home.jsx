// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Welcome to PawarFarm
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-xl mx-auto">
          Fresh organic farm products delivered to your doorstep.
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded shadow hover:bg-gray-100 transition"
        >
          Explore Products
        </Link>
      </section>

      {/* Product Categories */}
      <section className="flex-grow bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Our Product Categories
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: "Milk (Cow, Buffalo, Goat)", emoji: "🐄" },
            { name: "Organic Fertilizers", emoji: "🌿" },
            { name: "Homemade Pickles", emoji: "🥒" },
            { name: "Organic Vegetables", emoji: "🥕" },
            { name: "Organic Fruits", emoji: "🍎" },
            { name: "Milk Products (Khava, Kalakand)", emoji: "🧀" },
            { name: "Eggs Packs", emoji: "🥚" },
          ].map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-6xl mb-4">{category.emoji}</div>
              <h3 className="text-xl font-semibold">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-4 mt-auto">
        &copy; {new Date().getFullYear()} PawarFarm. All rights reserved.
      </footer>
    </div>
  );
}
