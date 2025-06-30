// pages/api/users/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === "DELETE") {
    try {
      await prisma.user.delete({ where: { id } });
      return res.status(200).json({ message: "Kullanıcı başarıyla silindi" });
    } catch (error) {
      return res.status(500).json({ message: "Kullanıcı silinirken hata oluştu" });
    }
  } else {
    return res.status(405).json({ message: "İzin verilmeyen istek yöntemi" });
  }
}
