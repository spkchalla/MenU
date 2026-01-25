import oauthProviders from "../../config/oauthProviders.js";
import axios from "axios";

const googleConfig = oauthProviders.google;

export const buildGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: googleConfig.clientId,
    redirect_uri: googleConfig.redirectUri,
    response_type: "code",
    scope: googleConfig.scopes.join(" "),
    prompt: "consent",
  });

  return `${googleConfig.authUrl}?${params.toString()}`;
};

export const exchangeCodeForGoogleTokens = async (code) => {
  const response = await axios.post(
    googleConfig.tokenUrl,
    new URLSearchParams({
      code,
      client_id: googleConfig.clientId,
      client_secret: googleConfig.clientSecret,
      redirect_uri: googleConfig.redirectUri,
      grant_type: "authorization_code",
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};

export const decodeGoogleIdToken = (idToken) => {
  const payloadBase64 = idToken.split(".")[1];

  const payload = JSON.parse(
    Buffer.from(payloadBase64, "base64").toString("utf-8")
  );

  return {
    email: payload.email,
    googleId: payload.sub,
    name: payload.name,
    picture: payload.picture,
  };
};
