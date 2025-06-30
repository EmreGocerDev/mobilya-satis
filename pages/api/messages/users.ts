// pages/api/messages/users.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { sentMessages: { some: {} } },
          { receivedMessages: { some: {} } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Kullanıcılar alınırken hata oluştu" });
  }
}
