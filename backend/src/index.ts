import express, { Express } from "express";
import dotenv from "dotenv";
import { getUser } from "./firebase/Authentication.js";
import { auth } from "./firebase/index.js";

dotenv.config();
export const app: Express = express();

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`SERVER WAS STARTED AT ${PORT}`);
});
app.get("/test", (req, res) => {
  console.log(req.body);
  res.json("Hello");
});

app.post("/register", async (req, res) => {
  const idToken = req.body?.idToken.toString();
  const csrfToken = req.body?.csrfToken.toString();

  if (csrfToken !== req.cookies.csrfToken) {
    res.status(401).send("Unauthorized Request.");
    return;
  }
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    await auth
      .createSessionCookie(idToken, { expiresIn })
      .then((sessionCookie) => {
        const options = { maxAge: expiresIn, secure: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      });
  } catch (err) {
    return err as string;
  }
});
