import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {

  try {

    const { id } =
      await context.params;

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id
        }
      });

    if (!reservation) {

      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (
      reservation.status ===
      "RELEASED"
    ) {

      return NextResponse.json({
        message:
          "Already released"
      });
    }

    await prisma.$transaction(
      async (tx) => {

        const inventory =
          await tx.inventory.findFirst({
            where: {
              productId:
                reservation.productId,
              warehouseId:
                reservation.warehouseId
            }
          });

        if (!inventory) {
          throw new Error(
            "INVENTORY_NOT_FOUND"
          );
        }

        await tx.inventory.update({
          where: {
            id: inventory.id
          },
          data: {
            reservedStock: {
              decrement:
                reservation.quantity
            }
          }
        });

        await tx.reservation.update({
          where: {
            id
          },
          data: {
            status: "RELEASED"
          }
        });

      }
    );

    return NextResponse.json({
      message:
        "Reservation released successfully"
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}