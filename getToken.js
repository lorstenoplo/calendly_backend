// getTokens.js
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const dotenv = require("dotenv");

dotenv.config();

const oAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const code =
  "4/0AdLIrYe7116dtUbEplqGAMQdT8qmm_PnGVwCD3XSjyvHRXcYISORpVH3ynf28BceIwRGaw"; // Replace with the code from the URL

async function getTokens() {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);
    // Save the tokens for later use
  } catch (error) {
    console.error("Error getting tokens:", error);
  }
}

getTokens();
