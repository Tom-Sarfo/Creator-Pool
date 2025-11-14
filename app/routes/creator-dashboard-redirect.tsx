import { redirect } from "react-router";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  // Preserve all query parameters when redirecting
  const searchParams = url.searchParams.toString();
  return redirect(`/creator${searchParams ? `?${searchParams}` : ""}`);
}
