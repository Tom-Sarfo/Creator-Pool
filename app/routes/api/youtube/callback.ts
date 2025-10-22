import type { Route } from "./+types/api/youtube/callback";
import { youtubeAPI } from "../../../lib/youtube-api";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error);
    return Response.redirect(
      "/creator/settings?youtube_error=" + encodeURIComponent(error)
    );
  }

  // Handle missing authorization code
  if (!code) {
    console.error("No authorization code received");
    return Response.redirect("/creator/settings?youtube_error=no_code");
  }

  try {
    // Exchange code for tokens
    const tokens = await youtubeAPI.exchangeCodeForTokens(code);

    // Get channel information
    const channel = await youtubeAPI.getChannel(tokens.access_token);

    // In a real application, you would store these tokens securely
    // For now, we'll return them in the response (NOT for production!)
    return Response.json({
      success: true,
      channel,
      tokens: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: tokens.expires_in,
      },
    });
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    return Response.redirect("/creator/settings?youtube_error=callback_failed");
  }
}
