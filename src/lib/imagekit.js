import ImageKit from "imagekit-javascript";

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const authenticationEndpoint = `${window.location.origin}/api/auth`;

const imagekit = new ImageKit({
    publicKey,
    urlEndpoint,
    authenticationEndpoint
});

export { imagekit, urlEndpoint, publicKey, authenticationEndpoint };
