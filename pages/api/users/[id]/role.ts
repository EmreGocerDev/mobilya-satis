// pages/api/users/[id]/role.ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === "PUT") {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Geçersiz rol" });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Rol güncellenirken hata oluştu" });
    }
  } else {
    return res.status(405).json({ message: "İzin verilmeyen istek yöntemi" });
  }
}
