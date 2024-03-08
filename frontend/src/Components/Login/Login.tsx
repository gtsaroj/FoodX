import React, { ChangeEvent, FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../../public/logo/Fx.png";
import { AuthNavbar } from "../Navbar/AuthNavbar";
import { AuthFooter } from "../Footer/AuthFooter";
import { makeRequest } from "../../makeRequest";

const LoginContainer: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [DataSend, SetDataSend] = useState<boolean>(true);

  const showPassword = () => {
    setShow((show) => !show);
    setPasswordType(passwordType === "text" ? "password" : "text");
  };

  const LoginFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      SetDataSend(true);
      const sendingLoginData = await makeRequest().post("/send-form/login", {
        email,
        password,
      });
      SetDataSend(false);
    } catch (error) {
      console.error(`Error occuring while sending form : ${error}`);
      SetDataSend(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full px-5 py-8">
      <div className="w-full h-full bg-[var(--light-foreground)] flex flex-col gap-8 rounded-lg shadow-sm">
        <div className="w-full px-5 py-6 text-5xl font-bold text-[var(--primary-color)] tracking-wide text-center">
          <h1 className="md:hidden">Login</h1>
          <h1 className="hidden md:block">Login with Email</h1>
        </div>
        <div className="px-3 py-4">
          <form className="flex flex-col gap-4 p-2" onSubmit={LoginFormSubmit}>
            <div className="relative flex flex-col gap-2">
              <label htmlFor="logEmail" className="text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="logEmail"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[var(--light-border)] focus:border-transparent focus:bg-[var(--light-border)] border bg-transparent rounded-md h-[40px] outline-none px-5 py-3 text-md"
              />
            </div>
            <div className="relative flex flex-col gap-2">
              <label htmlFor="logPassword" className="text-sm">
                Password
              </label>
              <input
                type={passwordType}
                name="password"
                id="logPassword"
                autoComplete="off"
                maxLength={25}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[var(--light-border)] focus:border-transparent focus:bg-[var(--light-border)] border bg-transparent rounded-md h-[40px] outline-none px-5 py-3 text-md"
              />

              {show ? (
                <div
                  className="text-[var(--dark-secondary-text)] absolute top-[37px] right-[10px] cursor-pointer"
                  onClick={showPassword}
                >
                  <Eye size={23} />
                </div>
              ) : (
                <div
                  className="text-[var(--dark-secondary-text)] absolute top-[37px] right-[10px] cursor-pointer"
                  onClick={showPassword}
                >
                  <EyeOff size={23} />
                </div>
              )}
            </div>

            <p className="text-[var(--dark-secondary-text)] text-sm cursor-pointer hover:underline select-none">
              Forgot Password?
            </p>
            <button className="h-[40px] rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)] text-xl font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5 ">
              {DataSend ? "submit" : "sending..."}
            </button>
            <p className="text-[var(--dark-secondary-text)] text-sm cursor-pointer hover:underline text-center mt-2 select-none">
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
  return (
    <div className=" min-w-[100vw] w-full max-w-[1800px] min-h-[100vh] h-full bg-[var(--light-background)] overflow-x-hidden">
      {/* Mobile */}
      <div className="flex flex-col w-full h-full md:hidden min-h-[90vh] gap-8">
        <AuthNavbar />
        <div className="flex items-center justify-center w-full h-full">
          <LoginContainer />
        </div>
      </div>
      {/* Tablet and Desktop */}
      <div className="items-center justify-around hidden min-h-[90vh] w-full gap-5 px-3 py-4 overflow-x-hidden md:flex">
        <div className="flex items-center justify-center">
          <img
            src={Logo}
            className="w-full max-w-[800px] max-h-[800px] min-h-[500px] "
            alt="logo"
          />
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
