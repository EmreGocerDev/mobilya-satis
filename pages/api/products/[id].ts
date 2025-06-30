// pages/api/products/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === "DELETE") {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return res.status(200).json({ message: "Ürün başarıyla silindi" });
    } catch (error) {
      return res.status(500).json({ message: "Ürün silinirken bir hata oluştu" });
    }
  }

  return res.status(405).json({ message: "İzin verilmeyen istek yöntemi" });
}
