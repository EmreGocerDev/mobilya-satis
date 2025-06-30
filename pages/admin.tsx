"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

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

export default function AdminPanel() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetch("/api/users").then(res => res.json()).then(setUsers);
    fetch("/api/products").then(res => res.json()).then(setProducts);
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }
    fetch(`/api/messages/user/${selectedUser.id}`)
      .then(res => res.json())
      .then(setMessages)
      .catch(console.error);
  }, [selectedUser]);

  const changeRole = (id: number, role: "user" | "admin") => {
    fetch(`/api/users/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    }).then(() => {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    });
  };

  const deleteUser = (id: number) => {
    fetch(`/api/users/${id}`, { method: "DELETE" }).then(() => {
      setUsers(prev => prev.filter(u => u.id !== id));
      if (selectedUser?.id === id) setSelectedUser(null);
    });
  };

  const deleteProduct = (id: number) => {
    fetch(`/api/products/${id}`, { method: "DELETE" }).then(() => {
      setProducts(prev => prev.filter(p => p.id !== id));
    });
  };

  const addProduct = () => {
    const { name, price, image } = newProduct;
    if (!name.trim() || !price.trim() || !image.trim()) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price), image }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Ürün eklenirken hata oluştu");
        return res.json();
      })
      .then(created => {
        setProducts(prev => [...prev, created]);
        setNewProduct({ name: "", price: "", image: "" });
      })
      .catch(err => alert(err.message));
  };

  // Mesaj gönderme (adminId sabit 1, auth ile değiştirilebilir)
  const sendMessage = () => {
    if (!selectedUser || !newMessage.trim()) return;

    const adminId = 1;

    fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: adminId,
        receiverId: selectedUser.id,
        content: newMessage.trim(),
      }),
    })
      .then(res => res.json())
      .then(msg => {
        setMessages(prev => [...prev, msg]);
        setNewMessage("");
      })
      .catch(console.error);
  };

  // Mesaj silme
  const deleteMessage = (id: number) => {
    fetch(`/api/messages/delete/${id}`, { method: "DELETE" })
      .then(() => {
        setMessages(prev => prev.filter(m => m.id !== id));
      })
      .catch(console.error);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Anasayfaya Dön Butonu */}
      <button
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          padding: "8px 12px",
          backgroundColor: "#64ffda",
          border: "none",
          borderRadius: "8px",
          color: "#0a192f",
          fontWeight: "700",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Anasayfaya Dön
      </button>

      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0a192f", color: "#64ffda", fontFamily: "Arial", padding: "1rem", gap: "1rem" }}>
        {/* Kullanıcılar */}
        <div style={{ flex: 1, backgroundColor: "#112240", borderRadius: 12, padding: 16, overflowY: "auto" }}>
          <h2>Kullanıcılar</h2>
          {users.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                marginBottom: 8,
                cursor: "pointer",
                backgroundColor: selectedUser?.id === user.id ? "#205075" : "transparent",
                padding: "4px",
                borderRadius: "4px",
              }}
            >
              <div>{user.name} ({user.email})</div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => changeRole(user.id, "admin")}>Admin Yap</button>
                <button onClick={() => changeRole(user.id, "user")}>User Yap</button>
                <button onClick={() => deleteUser(user.id)} style={{ color: "red" }}>Sil</button>
              </div>
            </div>
          ))}
        </div>

        {/* Ürünler */}
        <div style={{ flex: 1, backgroundColor: "#112240", borderRadius: 12, padding: 16, overflowY: "auto" }}>
          <h2>Ürünler</h2>
          {products.map(product => (
            <div key={product.id} style={{ marginBottom: 8 }}>
              <div>{product.name} - {product.price.toFixed(2)} ₺</div>
              <button onClick={() => deleteProduct(product.id)} style={{ color: "red" }}>Sil</button>
            </div>
          ))}
        </div>

        {/* Ürün Ekleme */}
        <div style={{ flex: 1, backgroundColor: "#112240", borderRadius: 12, padding: 16 }}>
          <h2>Ürün Ekle</h2>
          <input
            placeholder="Ürün adı"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: "6px", borderRadius: "4px", border: "none" }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Fiyat"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: "6px", borderRadius: "4px", border: "none" }}
          />
          <input
            placeholder="Resim URL"
            value={newProduct.image}
            onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
            style={{ width: "100%", marginBottom: 8, padding: "6px", borderRadius: "4px", border: "none" }}
          />
          <button
            onClick={addProduct}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#64ffda",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              color: "#0a192f",
              cursor: "pointer",
            }}
          >
            Ekle
          </button>
        </div>

        {/* Mesajlar */}
        <div style={{ flex: 1, backgroundColor: "#112240", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column" }}>
          <h2>Mesajlar {selectedUser ? `- ${selectedUser.name}` : ""}</h2>
          <div style={{ flex: 1, height: "300px", backgroundColor: "#0f274b", padding: 8, overflowY: "auto" }}>
            {selectedUser ? (
              messages.map(msg => (
                <div key={msg.id} style={{ marginBottom: 6, position: "relative" }}>
                  <b>{msg.senderId === selectedUser.id ? selectedUser.name : "Admin"}</b>: {msg.content}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    style={{
                      position: "absolute",
                      right: 0,
                      background: "none",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p>Kullanıcı seçiniz...</p>
            )}
          </div>
          <textarea
            placeholder="Cevap yaz..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            style={{ width: "100%", marginTop: 8, padding: "6px", borderRadius: "4px", border: "none" }}
            disabled={!selectedUser}
          />
          <button
            onClick={sendMessage}
            disabled={!selectedUser || !newMessage.trim()}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "8px",
              backgroundColor: selectedUser && newMessage.trim() ? "#64ffda" : "#333",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              color: "#0a192f",
              cursor: selectedUser && newMessage.trim() ? "pointer" : "default",
            }}
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
