import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./index";
import { Link, useNavigate } from "react-router-dom";

const emailVerification = async () => {
  const navigate = useNavigate();
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Unable to send email verification");
    await sendEmailVerification(currentUser);
    navigate("/email-verification");
  } catch (error) {
    throw new Error("Error sending verification email");
  }
};

const passwordResetEmail = async () => {
  try {
    const email = auth.currentUser?.email;
    if (!email) throw new Error("No user logged in.");
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error("Error sending password reset email");
  }
};

export { emailVerification, passwordResetEmail };
