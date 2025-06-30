import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Yalnızca POST metodu destekleniyor" });
  }

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurunuz." });
  }

  try {
    // Aynı email daha önce var mı kontrol et
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Bu email zaten kayıtlı." });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "admin", // rolü kendine göre ayarla
      },
    });

    return res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
}
