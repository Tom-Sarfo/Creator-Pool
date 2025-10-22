import type { Route } from "./+types/api/youtube/callback";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const state = url.searchParams.get("state");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error);
    const errorUrl = new URL("/creator/youtube-settings", request.url);
    errorUrl.searchParams.set("youtube_error", error);
    return Response.redirect(errorUrl.toString());
  }

  // Handle missing authorization code
  if (!code) {
    console.error("No authorization code received");
    const errorUrl = new URL("/creator/youtube-settings", request.url);
    errorUrl.searchParams.set("youtube_error", "no_code");
    return Response.redirect(errorUrl.toString());
  }

  try {
    // Get environment variables
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri =
      process.env.YOUTUBE_REDIRECT_URI ||
      "http://localhost:5178/api/youtube/callback";

    console.log("OAuth Callback Debug:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      redirectUri,
      code: code ? "present" : "missing",
    });

    if (!clientId || !clientSecret) {
      throw new Error("YouTube API credentials not configured");
    }

    // Exchange code for tokens
    console.log("Exchanging code for tokens...");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    console.log("Token response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange error:", errorData);
      throw new Error(
        errorData.error_description || "Failed to exchange code for tokens"
      );
    }

    const tokens = await tokenResponse.json();
    console.log("Tokens received successfully");

    // Get channel information
    console.log("Fetching channel information...");
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&access_token=${tokens.access_token}`
    );

    console.log("Channel response status:", channelResponse.status);

    if (!channelResponse.ok) {
      const errorData = await channelResponse.json();
      console.error("Channel fetch error:", errorData);
      throw new Error("Failed to fetch channel information");
    }

    const channelData = await channelResponse.json();
    console.log("Channel data received:", channelData);
    const channel = channelData.items?.[0];

    if (!channel) {
      console.error("No channel found in response:", channelData);
      throw new Error("No channel found");
    }

    // Store tokens in localStorage (client-side only for now)
    // In production, store securely on server
    const redirectUrl = new URL("/creator/youtube-settings", request.url);
    redirectUrl.searchParams.set("youtube_success", "true");

    // Create response with headers
    const response = new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl.toString(),
        "Set-Cookie": `youtube_tokens=${JSON.stringify({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
          tokenType: tokens.token_type,
          channelId: channel.id,
          channelTitle: channel.snippet.title,
          channelThumbnail: channel.snippet.thumbnails.default.url,
        })}; Path=/; HttpOnly; SameSite=Lax`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    const errorUrl = new URL("/creator/youtube-settings", request.url);
    errorUrl.searchParams.set("youtube_error", "callback_failed");
    return Response.redirect(errorUrl.toString());
  }
}
