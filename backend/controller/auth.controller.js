import {
  buildGoogleAuthUrl,
  exchangeCodeForGoogleTokens,
  decodeGoogleIdToken,
} from "../utils/oauth/googleOAuth.js";

import { generateJWT } from "../utils/jwt.js";

import { findOrCreateGoogleUser } from "../services/userAuthServices.js";

export const googleLogin = (req, res) => {
  try {
    const url = buildGoogleAuthUrl();
    console.log("=== GOOGLE OAUTH URL START ===");
    console.log(url);
    console.log("=== GOOGLE OAUTH URL END ===");
    res.redirect(url);
  } catch (err) {
    res.status(500).json({
      error: "Error happened in building google oauth",
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Authorization code missing",
      });
    }
    const tokenResponse = await exchangeCodeForGoogleTokens(code);
    const { id_token } = tokenResponse;

    if (!id_token) {
      return res.status(500).json({
        error: "Id token not returned by google",
      });
    }

    const googleUser = decodeGoogleIdToken(id_token);

    console.log("Google User: ", googleUser);

    const user = await findOrCreateGoogleUser({
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
    });
    const token = generateJWT({
      userId: user._id,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    // Pass token as fallback for environments where third-party cookies are blocked or cross-port issues exist
    return res.redirect(`${frontendUrl}?token=${token}&role=${user.role}&id=${user._id}`);
  } catch (err) {
    return res.status(500).json({
      error: "Google Oauth callback failed",
    });
  }
};
