// pages/api/messages/delete/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (req.method !== "DELETE") return res.status(405).json({ message: "Yalnızca DELETE metodu desteklenir" });

  try {
    await prisma.message.delete({ where: { id } });
    return res.status(200).json({ message: "Mesaj silindi" });
  } catch (err) {
    return res.status(500).json({ message: "Silme işlemi başarısız" });
  }
}
