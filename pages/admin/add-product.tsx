"use client";
import { useState } from "react";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price), image }),
    });

    if (res.ok) {
      setMessage("✅ Ürün başarıyla eklendi!");
      setIsError(false);
      setName("");
      setPrice("");
      setImage("");
    } else {
      const data = await res.json();
      setMessage("❌ Hata: " + data.message);
      setIsError(true);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[#0a192f]"
      style={{ padding: "25px" }}
    >
      <section
        className="bg-[#112240] rounded-2xl shadow-xl"
        style={{ width: "500px", padding: "25px", margin: "25px" }}
      >
        <h1 className="text-[#64ffda] text-3xl font-extrabold mb-6 text-center select-none">
          Yeni Ürün Ekle
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: "25px" }}>
          <input
            type="text"
            placeholder="Ürün Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl bg-[#233554] border border-gray-700 px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#64ffda] transition"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Fiyat"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="rounded-xl bg-[#233554] border border-gray-700 px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#64ffda] transition"
          />

          <input
            type="text"
            placeholder="Resim URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="rounded-xl bg-[#233554] border border-gray-700 px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#64ffda] transition"
          />

          <button
            type="submit"
            className="rounded-xl bg-[#64ffda] py-4 font-semibold text-[#0a192f] hover:bg-[#52cbbf] transition"
          >
            Ürünü Ekle
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center font-medium select-none ${
              isError ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
