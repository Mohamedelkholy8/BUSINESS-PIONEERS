import ImageKit from "imagekit";

export default function handler(request, response) {
  const imagekit = new ImageKit({
    publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT,
  });

  const authenticationParameters = imagekit.getAuthenticationParameters();
  response.status(200).json(authenticationParameters);
}
