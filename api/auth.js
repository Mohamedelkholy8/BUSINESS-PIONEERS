import crypto from "crypto";

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

  const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").trim();
  
  if (!privateKey) {
    return response.status(500).json({ error: "Private Key missing in Vercel" });
  }

  // Generate parameters manually
  const token = crypto.randomBytes(16).toString("hex");
  const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now

  // Manual HMAC-SHA1 signature generation
  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire.toString())
    .digest("hex");

  response.status(200).json({
    token,
    expire,
    signature
  });
}
