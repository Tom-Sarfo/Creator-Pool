import type { Route } from "./+types/api/youtube/tokens";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Get tokens from cookies
    const cookieHeader = request.headers.get("Cookie");
    console.log("Tokens endpoint: Cookie header:", cookieHeader);

    if (!cookieHeader) {
      console.log("Tokens endpoint: No cookies found");
      return Response.json({ error: "No cookies found" }, { status: 401 });
    }

    const cookies = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    const youtubeTokens = cookies.youtube_tokens;
    console.log(
      "Tokens endpoint: YouTube tokens cookie:",
      youtubeTokens ? "Found" : "Not found"
    );

    if (!youtubeTokens) {
      console.log("Tokens endpoint: No YouTube tokens found in cookies");
      return Response.json(
        { error: "No YouTube tokens found" },
        { status: 401 }
      );
    }

    try {
      // First decode URI component, then parse JSON
      const decodedTokens = decodeURIComponent(youtubeTokens);
      console.log(
        "Tokens endpoint: Decoded tokens length:",
        decodedTokens.length
      );
      const tokens = JSON.parse(decodedTokens);
      console.log("Tokens endpoint: Parsed tokens successfully:", {
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        channelId: tokens.channelId,
        channelTitle: tokens.channelTitle,
      });

      return Response.json({
        success: true,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          channelId: tokens.channelId,
          channelTitle: tokens.channelTitle,
          channelThumbnail: tokens.channelThumbnail,
        },
      });
    } catch (parseError) {
      console.error("Tokens endpoint: Parse error:", parseError);
      return Response.json({ error: "Invalid token format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error getting tokens:", error);
    return Response.json({ error: "Failed to get tokens" }, { status: 500 });
  }
}
