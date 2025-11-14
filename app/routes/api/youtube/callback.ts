import { youtubeService } from "../../../services/youtube.service";
import { redirect } from "react-router";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const state = url.searchParams.get("state");

  if (error) {
    return redirect("/creator?youtube_error=" + encodeURIComponent(error));
  }

  if (!code) {
    return redirect("/creator?youtube_error=no_code");
  }

  try {
    await youtubeService.handleCallback({ code, state: state || undefined });

    // Redirect to creator dashboard with success parameter using React Router redirect
    // Use /creator (index route) instead of /creator/dashboard to avoid route matching issues
    return redirect("/creator?youtube=connected");
  } catch (error) {
    return redirect("/creator?youtube_error=callback_failed");
  }
}
