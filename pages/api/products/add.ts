import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Sadece POST istekleri desteklenir." });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.email == null) {
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

  const newProduct = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      image,
      userId: user.id,
    },
  });

  return res.status(201).json(newProduct);
}
