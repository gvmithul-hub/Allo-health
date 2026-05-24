import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes } from "date-fns";

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const {
      productId,
      warehouseId,
      quantity
    } = body;

    const result = await prisma.$transaction(
      async (tx) => {

        const inventory =
          await tx.inventory.findFirst({
            where: {
              productId,
              warehouseId
            }
          });

        if (!inventory) {
          throw new Error("INVENTORY_NOT_FOUND");
        }

        const availableStock =
          inventory.totalStock -
          inventory.reservedStock;

        if (availableStock < quantity) {
          throw new Error("OUT_OF_STOCK");
        }

        await tx.inventory.update({
          where: {
            id: inventory.id
          },
          data: {
            reservedStock: {
              increment: quantity
            }
          }
        });

        const reservation =
          await tx.reservation.create({
            data: {
              productId,
              warehouseId,
              quantity,
              status: "PENDING",
              expiresAt: addMinutes(
                new Date(),
                10
              )
            }
          });

        return reservation;
      }
    );

    return NextResponse.json(result);

  } catch (error: any) {

    console.log(error);

    if (error.message === "OUT_OF_STOCK") {

      return NextResponse.json(
        { error: "Not enough stock" },
        { status: 409 }
      );
    }

    if (
      error.message ===
      "INVENTORY_NOT_FOUND"
    ) {

      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}