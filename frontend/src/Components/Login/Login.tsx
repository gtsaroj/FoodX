import React, { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/logo/Fx.png";
import { AuthNavbar } from "../Navbar/AuthNavbar";
import { AuthFooter } from "../Footer/AuthFooter";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/HashLoader";
import { signInAction } from "../../Actions/user.actions";

//Login container
export const LoginContainer: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const showPassword = () => {
    setShow((show) => !show);
    setPasswordType(passwordType === "text" ? "password" : "text");
  };

  const dispatch = useDispatch<AppDispatch>();

  const LoginFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      await dispatch(signInAction({ email, password, userRole: "customer" }));
    } catch (error) {
      throw new Error("Error while loging" + error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-full h-full px-3 py-8">
      <div className="w-full  bg-[var(--light-foreground)] flex flex-col gap-8 rounded-lg shadow-sm">
        <div className="w-full flex flex-col items-center gap-3 px-3 py-6  text-[30px] font-bold text-[var(--primary-color)] tracking-wide text-center">
          <h1 className="md:hidden text-[var(--dark-text)] ">Login</h1>
          <h1 className="hidden md:block text-[var(--dark-text)] ">
            Login with Email
          </h1>
        </div>
        <div className="px-3 py-4">
          <form
            className="flex  text-[var(--dark-text)] flex-col gap-4 p-2"
            onSubmit={LoginFormSubmit}
          >
            <div className="relative flex flex-col gap-2">
              <label htmlFor="logEmail" className="text-[15px]">
                Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[var(--dark-border)] border-[1px] sm:text-[16px] text-[14px]  bg-transparent rounded-md  h-[35px] sm:h-[40px] outline-none px-5 py-3 text-md"
              />
            </div>
            <div className="relative flex flex-col gap-2">
              <label htmlFor="logPassword" className="text-[15px]">
                Password
              </label>
              <input
                type={passwordType}
                name="password"
                autoComplete="off"
                maxLength={25}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[var(--dark-border)] sm:text-[16px] text-[14px] border-[1px] bg-transparent rounded-md  h-[35px] sm:h-[40px] outline-none px-5 py-3 text-md"
              />

              {show ? (
                <div
                  className="text-[var(--dark-secondary-text)] absolute top-[37px] right-[10px] cursor-pointer"
                  onClick={showPassword}
                >
                  <Eye className=" size-5 sm:size-6" />
                </div>
              ) : (
                <div
                  className="text-[var(--dark-secondary-text)] absolute top-[37px] right-[10px] cursor-pointer"
                  onClick={showPassword}
                >
                  <EyeOff className=" size-5 sm:size-6" />
                </div>
              )}
            </div>

            <p
              onClick={() => navigate("/forgot-password")}
              className="text-[var(--dark-secondary-text)] text-sm cursor-pointer hover:underline select-none"
            >
              Forgot Password?
            </p>
            <button
              disabled={loading}
              className="sm:h-[40px] h-[37px] rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-white  text-lg sm:text-xl  tracking-wider font-semibold transition-colors duration-500 ease-in-out mt-5 "
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  Sending <ClipLoader color="white" size={"20px"} />
                </div>
              ) : (
                "Submit"
              )}
            </button>
            <p
              className="text-[var(--dark-secondary-text)] text-sm cursor-pointer hover:underline text-center mt-2 select-none"
              onClick={() => navigate("/register")}
            >
              Don't have an account?{" "}
              <span className="hover:text-[var(--primary-color)]">
                Register Here.
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  useEffect(() => {
    document.body.classList.remove("dark");
  }, []);
  return (
    <div className=" min-w-[100vw] w-full  h-full bg-[var(--body-bg)] overflow-x-hidden">
      {/* Mobile */}
      <div className="flex flex-col items-center w-full h-full lg:hidden min-h-[90vh] gap-8">
        <AuthNavbar />
        <div className="flex items-center justify-center w-full sm:w-[600px] h-full">
          <LoginContainer />
        </div>
      </div>
      {/* Tablet and Desktop */}
      <div className="items-center justify-around hidden min-h-[90vh] w-full gap-5 px-3 py-4 overflow-x-hidden lg:flex">
        <div className="flex items-center justify-center">
          <img src={Logo} className="w-full max-w-[800px]  " alt="logo" />
        </div>
        <div className=" max-w-[700px] w-full pr-8">
          <LoginContainer />
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};
export default Login;
