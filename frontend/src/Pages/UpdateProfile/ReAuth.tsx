import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import ClipLoader from "react-spinners/HashLoader";
import { reAuthUser } from "../../firebase/utils";
import toast from "react-hot-toast";

const ReAuth = ({ reAuthUsers }: any) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );

  const [dataSend, setDataSend] = useState<boolean>(true);

  const showPassword = () => {
    setShow((show) => !show);
    setPasswordType(passwordType === "text" ? "password" : "text");
  };

  const LoginFormSubmit = async () => {
    try {
      setDataSend(false);
    } catch (error) {
      console.error(`Error occuring while sending form : ${error}`);
      setDataSend(true);
    }
  };

  const HandleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await reAuthUser(email, password)
        .then(() => {
          reAuthUsers();
        })
        .catch(() => {
          return toast.error("Invalid Email or Password");
        });
    } catch (error) {}
  };
  return (
    <div
      className={`w-[100vw] h-[80vh] flex justify-center items-center px-5 z-30`}
    >
      <div className="flex items-center justify-center max-w-[800px] min-w-[400px] w-[600px] px-3 py-8">
        <div className="w-full h-full bg-[var(--light-foreground)] flex flex-col gap-8 rounded-lg shadow-sm relative">
          <div className="w-full flex flex-col items-center gap-3 px-3 py-6  text-[30px] font-bold text-[var(--primary-color)] tracking-wide text-center">
            <h1 className="md:hidden">ReAuthenticate</h1>
            <h1 className="hidden md:block">ReAuthenticate</h1>
          </div>
          <div className="px-3 py-4">
            <form
              className="flex flex-col gap-4 p-2"
              onSubmit={() =>
                HandleSubmit(event as unknown as FormEvent<HTMLFormElement>)
              }
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
                  className="border-[var(--light-border)] focus:border-transparent focus:bg-[var(--light-border)] border bg-transparent rounded-md h-[40px] outline-none px-5 py-3 text-md"
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

              <p
                onClick={() => navigate("/forgot-password")}
                className="text-[var(--dark-secondary-text)] text-sm cursor-pointer hover:underline select-none"
              >
                Forgot Password?
              </p>
              <button
                className="h-[40px] rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)] text-xl font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5 "
                type="submit"
                onClick={LoginFormSubmit}
              >
                {dataSend ? (
                  "Submit"
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sending <ClipLoader color="white" size={"20px"} />
                  </div>
                )}
              </button>
            </form>
          </div>
          {/* <div onClick={()=> setClose(!close) } className="absolute top-0 right-0 p-3  rounded-tr-md text-[var(--secondary-color)] cursor-pointer hover:bg-[var(--secondary-light)] hover:text-[var(--light-text)] transition-all ease-in-out duration-150 ">
            <X />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ReAuth;

// export const ReAuthContainer = () => {
//   return (
//     <div className="w-[100vw] h-[80vh] bg-[#00000041] flex justify-center items-center px-5 z-30">
//       <ReAuth />
//     </div>
//   );
// };
