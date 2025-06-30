import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
      return res.status(200).json(products);
    } catch (err) {
      console.error("API error:", err);
      return res.status(500).json({ message: "Ürünler alınamadı" });
    }
  }

  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ message: "Yetkisiz." });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Bu işlemi sadece admin yapabilir." });
    }

    const { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ message: "Tüm alanlar gereklidir." });
    }

    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          image,
          userId: user.id,
        },
      });
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
      return res.status(500).json({ message: "Ürün eklenirken hata oluştu" });
    }
  }

  return res.status(405).json({ message: "Yalnızca GET ve POST metodları desteklenir." });
}
