import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const expiredReservations =
      await prisma.reservation.findMany({
        where: {
          status: "PENDING",
          expiresAt: {
            lt: new Date()
          }
        }
      });

    for (
      const reservation
      of expiredReservations
    ) {

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

          if (!inventory) return;

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
              id: reservation.id
            },
            data: {
              status: "RELEASED"
            }
          });

        }
      );
    }

    return NextResponse.json({
      success: true,
      released:
        expiredReservations.length
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Internal Server Error"
      },
      {
        status: 500
      }
    );
  }
}