"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  // Mesajlaşma için state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll’u en alta kaydırmak için fonksiyon
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Ürünleri yükle
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Mesajları yükle (admin id’yi örnek sabit 1 olarak kullandım)
  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`/api/messages/user/${session.user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        scrollToBottom();
      });
  }, [session?.user?.id]);

  // Mesaj gönderme
  const sendMessage = () => {
    if (!newMessage.trim() || !session?.user?.id) return;

    const adminId = 1; // Admin ID (sabit, gerçek projede auth ile dinamik)

    fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: session.user.id,
        receiverId: adminId,
        content: newMessage.trim(),
      }),
    })
      .then((res) => res.json())
      .then((msg) => {
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
        scrollToBottom();
      })
      .catch(console.error);
  };

  // Sepete ürün ekle
  const addToCart = (product: Product) => {
    if (!cart.find((p) => p.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  // Sepetten ürün çıkar
  const removeFromCart = (id: number) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0a192f",
        color: "#64ffda",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        gap: "2rem",
        position: "relative",
        boxShadow: "none", // ışımayı kaldırdık
      }}
    >
      {/* Sağ üst butonlar */}
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          display: "flex",
          gap: "0.7rem",
          zIndex: 9999,
        }}
      >
        {session?.user?.role === "admin" && (
          <button
            onClick={() => (window.location.href = "/admin")}
            style={{
              backgroundColor: "#64ffda",
              color: "#0a192f",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            Admin Paneli
          </button>
        )}

        {session?.user?.name ? (
          <button
            onClick={() => signOut()}
            style={{
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            Çıkış Yap
          </button>
        ) : (
          <button
            onClick={() => (window.location.href = "/login")}
            style={{
              backgroundColor: "#64ffda",
              color: "#0a192f",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            Giriş Yap
          </button>
        )}
      </div>

      {/* Sol panel */}
      <section
        style={{
          backgroundColor: "#112240",
          borderRadius: "12px",
          padding: "2rem",
          width: "280px",
          color: "#64ffda",
          fontWeight: "700",
          fontSize: "1.1rem",
          boxShadow: "none", // ışımayı kaldırdık
        }}
      >
        <h2>Kullanıcı Bilgileri</h2>
        <p>İsim: {session?.user?.name || "Bilinmiyor"}</p>
        <p>E-posta: {session?.user?.email || "Bilinmiyor"}</p>
        <p>Rol: {session?.user?.role || "user"}</p>

        <hr style={{ margin: "1rem 0", borderColor: "#64ffda" }} />

        <h3>Sepetim</h3>
        {cart.length === 0 ? (
          <p>Sepetiniz boş</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {cart.map((item) => (
              <li key={item.id} style={{ marginBottom: "0.8rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    {item.name} - {item.price.toFixed(2)} ₺
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      backgroundColor: "#ff4d4d",
                      border: "none",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                      padding: "0.2rem 0.5rem",
                      fontWeight: "700",
                    }}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Ürün listeleme */}
      <section
        style={{
          backgroundColor: "#112240",
          borderRadius: "12px",
          padding: "2rem",
          flexGrow: 1,
          gap: "1rem",
          color: "#64ffda",
          boxShadow: "none", // ışımayı kaldırdık
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Ürünler</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {products.length === 0 ? (
            <p>Yükleniyor...</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: "#0f274b",
                  borderRadius: "10px",
                  padding: "1rem",
                  boxShadow: "none", // ışımayı kaldırdık
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                  }}
                />
                <h3 style={{ marginBottom: "0.5rem" }}>{product.name}</h3>
                <p style={{ color: "#a0f7e3" }}>{product.price.toFixed(2)} ₺</p>
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    marginTop: "0.5rem",
                    width: "100%",
                    backgroundColor: "#64ffda",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                    color: "#0a192f",
                    fontSize: "1rem",
                    transition: "background-color 0.3s",
                  }}
                >
                  Sepete Ekle
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Sağdaki mesajlaşma alanı */}
      <section
        style={{
          backgroundColor: "#112240",
          borderRadius: "12px",
          padding: "2rem",
          width: "300px",
          display: "flex",
          flexDirection: "column",
          color: "#64ffda",
          boxShadow: "none", // ışımayı kaldırdık
        }}
      >
        <div
          style={{
            borderBottom: "2px solid #64ffda",
            fontWeight: "700",
            fontSize: "1.3rem",
            paddingBottom: "0.6rem",
            marginBottom: "1rem",
          }}
        >
          Yardım
        </div>
        <div
          style={{
            flexGrow: 1,
            backgroundColor: "#0f274b",
            borderRadius: "8px",
            padding: "1rem",
            color: "#a0f7e3",
            fontSize: "0.95rem",
            overflowY: "auto",
            minHeight: "200px",
          }}
        >
          {messages.length === 0 ? (
            <p>Henüz mesaj yok</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: 8,
                  backgroundColor:
                    msg.senderId === session?.user?.id ? "#175e26" : "#134d75",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  alignSelf:
                    msg.senderId === session?.user?.id ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}
              >
                {msg.content}
                <div style={{ fontSize: "0.7rem", marginTop: 4, opacity: 0.7 }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <input
          type="text"
          placeholder="Mesaj yazın..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
                        fontWeight: "600",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#064f5f",
            color: "#64ffda",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginTop: "0.8rem",
            padding: "0.8rem",
            backgroundColor: "#64ffda",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            color: "#0a192f",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Gönder
        </button>
      </section>
    </main>
  );
}

