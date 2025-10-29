import { youtubeService } from "../../../services/youtube.service";
import { API_CONFIG } from "../../../lib/api-config";

export async function loader({ request }: { request: Request }) {
  try {
    // Extract token from request headers or cookies for server-side
    const authHeader = request.headers.get("Authorization");
    const cookies = request.headers.get("Cookie");
    let token: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (cookies) {
      // Try to extract token from cookies if using cookie-based auth
      const tokenMatch = cookies.match(
        new RegExp(`${API_CONFIG.ACCESS_TOKEN_KEY}=([^;]+)`)
      );
      token = tokenMatch ? tokenMatch[1] : null;
    }

    const response = await youtubeService.getAuthUrl(token);

    // Handle both direct response and response.data
    const authUrl = response.authUrl || (response as any).data?.authUrl;

    if (!authUrl) {
      return Response.json(
        {
          error: "No authorization URL in backend response",
          success: false,
          details: response,
        },
        { status: 500 }
      );
    }

    return Response.json({
      authUrl: authUrl,
      success: true,
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Failed to get authorization URL from backend",
        success: false,
        details: error?.message || error?.toString() || "Unknown error",
        status: error?.status || 500,
      },
      { status: error?.status || 500 }
    );
  }
}
