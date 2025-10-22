import type { Route } from "./+types/api/youtube/auth";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    console.log("YouTube Auth Route Hit");

    // Generate the OAuth authorization URL directly
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const redirectUri =
      process.env.YOUTUBE_REDIRECT_URI ||
      "http://localhost:5178/api/youtube/callback";

    console.log("Auth Debug:", {
      hasClientId: !!clientId,
      redirectUri,
      clientId: clientId ? `${clientId.substring(0, 10)}...` : "missing",
    });

    if (!clientId) {
      throw new Error("YouTube client ID not configured");
    }

    const scopes = [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ];

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", scopes.join(" "));
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    // Return the authorization URL
    return Response.json({
      authUrl: authUrl.toString(),
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
