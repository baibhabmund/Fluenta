"use client";
import { AlertTriangle } from "lucide-react";
import { ErrorState } from "@/components/error-state";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      icon={AlertTriangle}
      title="Something went wrong"
      body="Please try again, or head back home."
      action={
        <button
          className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-brand-600/20 transition hover:bg-brand-700"
          onClick={reset}
        >
          Retry
        </button>
      }
    />
  );
}
