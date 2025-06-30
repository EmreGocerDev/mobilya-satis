// pages/api/messages/send.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Sadece POST istekleri desteklenir." });

  const { senderId, receiverId, content } = req.body;

  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ message: "Eksik veri gönderildi." });
  }

  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
    return res.status(201).json(message);
  } catch (err) {
    return res.status(500).json({ message: "Mesaj gönderilirken hata oluştu." });
  }
}
