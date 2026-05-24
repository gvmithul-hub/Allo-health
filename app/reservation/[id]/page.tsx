"use client";

import { useEffect, useState } from "react";

export default function ReservationPage(
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) {

  const [reservation, setReservation] =
    useState<any>(null);

  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {

    async function loadReservation() {

      const { id } =
        await params;

      const response =
        await fetch(
          `/api/reservations/${id}`
        );

      const data =
        await response.json();

      setReservation(data);
    }

    loadReservation();

  }, [params]);

  useEffect(() => {

    if (!reservation) return;

    const interval = setInterval(() => {

      const now =
        new Date().getTime();

      const expiry =
        new Date(
          reservation.expiresAt
        ).getTime();

      const distance =
        expiry - now;

      if (distance <= 0) {

        setTimeLeft("Expired");

        clearInterval(interval);

        return;
      }

      const minutes =
        Math.floor(
          distance / 1000 / 60
        );

      const seconds =
        Math.floor(
          (distance / 1000) % 60
        );

      setTimeLeft(
        `${minutes}:${
          seconds < 10
            ? "0"
            : ""
        }${seconds}`
      );

    }, 1000);

    return () =>
      clearInterval(interval);

  }, [reservation]);

  async function confirmReservation() {

    const response =
      await fetch(
        `/api/reservations/${reservation.id}/confirm`,
        {
          method: "POST"
        }
      );

    const data =
      await response.json();

    alert(
      data.message ||
      "Reservation Confirmed"
    );

    window.location.reload();
  }

  async function cancelReservation() {

    const response =
      await fetch(
        `/api/reservations/${reservation.id}/release`,
        {
          method: "POST"
        }
      );

    const data =
      await response.json();

    alert(
      data.message ||
      "Reservation Cancelled"
    );

    window.location.reload();
  }

  if (!reservation) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (

    <main className="p-10">

      <div className="
        max-w-xl
        mx-auto
        border
        rounded-lg
        p-6
        space-y-6
      ">

        <h1 className="
          text-3xl
          font-bold
        ">
          Reservation Details
        </h1>

        <div>

          <p>
            Reservation ID:
          </p>

          <p className="
            text-sm
            break-all
            text-gray-500
          ">
            {reservation.id}
          </p>

        </div>

        <div>

          <p>Status:</p>

          <p className="font-bold">
            {reservation.status}
          </p>

        </div>

        <div>

          <p>Time Remaining:</p>

          <p className="
            text-2xl
            font-bold
          ">
            {timeLeft}
          </p>

        </div>

        <div className="
          flex
          gap-4
        ">

          <button
            onClick={
              confirmReservation
            }
            className="
              bg-green-600
              text-white
              px-4
              py-2
              rounded-md
            "
          >
            Confirm Purchase
          </button>

          <button
            onClick={
              cancelReservation
            }
            className="
              bg-red-600
              text-white
              px-4
              py-2
              rounded-md
            "
          >
            Cancel
          </button>

        </div>

      </div>

    </main>
  );
}