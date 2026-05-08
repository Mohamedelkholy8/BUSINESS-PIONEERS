import ImageKit from "imagekit";

export default function handler(request, response) {
  // CORS Headers
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // Use .trim() to prevent hidden space/newline issues
  const publicKey = (process.env.VITE_IMAGEKIT_PUBLIC_KEY || "").trim();
  const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").trim();
  const urlEndpoint = (process.env.VITE_IMAGEKIT_URL_ENDPOINT || "").trim();

  if (!publicKey || !privateKey) {
    return response.status(500).json({ error: "Missing ImageKit Keys in Environment" });
  }

  const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    response.status(200).json(authenticationParameters);
  } catch (error) {
    console.error("Auth Error:", error);
    response.status(500).json({ error: "Failed to generate signature" });
  }
}
