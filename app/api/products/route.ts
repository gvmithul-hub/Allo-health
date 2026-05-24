import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const products = await prisma.product.findMany({
    include: {
      inventory: {
        include: {
          warehouse: true
        }
      }
    }
  });

  return NextResponse.json(products);
}