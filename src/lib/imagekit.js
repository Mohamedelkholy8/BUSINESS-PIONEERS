import ImageKit from "imagekit-javascript";

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

// Robust authenticator function for React SDK
const authenticator = async () => {
    try {
        const response = await fetch('/api/auth');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Auth failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

// We still keep the JS SDK instance for manual usage if needed
const imagekit = new ImageKit({
    publicKey,
    urlEndpoint,
    authenticationEndpoint: "/api/auth" // Keep this as fallback
});

export { imagekit, urlEndpoint, publicKey, authenticator };
