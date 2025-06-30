// pages/api/messages/user/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = Number(req.query.id);
  if (isNaN(userId)) return res.status(400).json({ message: "Geçersiz kullanıcı ID" });

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ message: "Mesajlar alınırken hata oluştu" });
  }
}
