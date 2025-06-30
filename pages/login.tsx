import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Lütfen email ve şifrenizi girin.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res && res.error) {
      setError("Giriş başarısız: " + res.error);
    } else {
      setError("");
      router.push("/");
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Giriş Yap</h1>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Giriş Yap
        </button>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.registerText}>
          Henüz aramıza katılmadınız mı?{" "}
          <a href="/register" style={styles.registerLink}>
            Kayıt Ol
          </a>
        </p>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    margin: 0,
    padding: 0,
    backgroundColor: "#0a192f",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ccd6f6",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
  },
  form: {
    backgroundColor: "#112240",
    padding: 30,
    borderRadius: 10,
    boxShadow: "0 0 20px rgba(2,12,27,0.7)",
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: 30,
    fontWeight: "bold",
    fontSize: 28,
    color: "#64ffda",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#233554",
    border: "none",
    borderRadius: 5,
    padding: "12px 15px",
    marginBottom: 20,
    color: "#ccd6f6",
    fontSize: 16,
    outline: "none",
  },
  button: {
    backgroundColor: "#64ffda",
    border: "none",
    borderRadius: 5,
    padding: "12px 15px",
    fontWeight: "bold",
    fontSize: 18,
    cursor: "pointer",
    color: "#0a192f",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "#ff5555",
    marginTop: 10,
    textAlign: "center",
  },
  registerText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
    color: "#8892b0",
  },
  registerLink: {
    color: "#64ffda",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
