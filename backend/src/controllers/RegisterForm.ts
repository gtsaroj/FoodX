import { auth } from "../firebase/index.js";
import { app } from "../index.js";

app.post("/register", async (req, res) => {
  const idToken = req.body.idToken.toString();
  const csrfToken = req.body.csrfToken.toString();

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
