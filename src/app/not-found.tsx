import { Compass } from "lucide-react";
import { ErrorState } from "@/components/error-state";

export default function NotFound() {
  return (
    <ErrorState
      code="Error 404"
      icon={Compass}
      title="Page not found"
      body="The page you're looking for doesn't exist or has moved."
    />
  );
}
