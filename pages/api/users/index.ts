import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true },
      });
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Kullanıcılar alınırken hata oluştu" });
    }
  } else {
    res.status(405).json({ message: "İzin verilmeyen istek yöntemi" });
  }
}
