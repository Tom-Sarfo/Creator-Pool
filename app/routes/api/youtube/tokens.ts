import type { Route } from "./+types/api/youtube/tokens";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Get tokens from cookies
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
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
    if (!youtubeTokens) {
      return Response.json(
        { error: "No YouTube tokens found" },
        { status: 401 }
      );
    }

    try {
      const tokens = JSON.parse(decodeURIComponent(youtubeTokens));
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
      return Response.json({ error: "Invalid token format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error getting tokens:", error);
    return Response.json({ error: "Failed to get tokens" }, { status: 500 });
  }
}
