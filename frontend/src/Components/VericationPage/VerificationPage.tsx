import { Send } from "lucide-react";

const VerificationPage = () => {
  return (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center sm:justify-evenly  sm:gap-8 gap-16">
      <div className=" flex justify-center items-center bg-[var(--secondary-color)] p-5 rounded-full">
        <Send className=" w-20 h-20 text-[var(--light-text)]" />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 px-6">
        <div className="flex flex-col items-center">
          <h1 className="text-[30px] text-[var(--dark-text)] font-bold">
            Check your email
          </h1>
          <h2 className=" text-[15px] sm:text-[17px] text-[var(--dark-secondary-text)]">
            To confirm your email address, tap to button in the email we sent to
            you
          </h2>
        </div>
        <a href="https://mail.google.com/mail/u/0/#inbox">
          {" "}
          <button className="text-[var(--light-text)] py-2 px-10 rounded-md bg-[var(--secondary-color)]">
            Open email app
          </button>
        </a>
      </div>
    </div>
  );
};

export default VerificationPage;
