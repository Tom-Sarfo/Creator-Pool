import type { Route } from "./+types/api/youtube/auth";
import { youtubeAPI } from "../../../lib/youtube-api";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Generate the OAuth authorization URL
    const authUrl = youtubeAPI.getAuthorizationUrl();

    // Return the authorization URL
    return Response.json({
      authUrl,
      success: true,
    });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return Response.json(
      {
        error: "Failed to generate authorization URL",
        success: false,
      },
      { status: 500 }
    );
  }
}
