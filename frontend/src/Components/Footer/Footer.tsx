import { Clock, Mail, MapPin, Phone } from "lucide-react";
import CollegeLogo from "../../logo/texas.png";

const Footer: React.FC = () => {
  return (
    <div className="w-full flex text-white flex-col ">
      <footer className="w-full mt-16  rounded-t  bg-[var(--primary-color)] text-white place-items-center grid px-5">
        <div className="flex flex-col items-center justify-between w-full gap-5 p-3 border-b-4 border-b-[var(--light-border)] sm:flex-row">
          <div className="px-5 py-3 bg-[var(--light-background)] rounded">
            <img src={CollegeLogo} className="max-h-[60px] " />
          </div>
          <div className="flex items-center justify-center gap-3">
            <p className="font-bold tracking-wide ext-lg ">Follow us: </p>
            <div></div>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 py-4 md:grid-cols-2 place-items-center md:place-items-start">
          <div className="flex flex-col gap-6 p-5">
            <p className="font-bold tracking-wider">Quick Contact</p>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center">
                  <MapPin />
                </div>
                <div>
                  <p>Sifal, Chabahil</p>
                  <p>Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center flex-wrap">
                  <Phone />
                </div>
                <div>
                  <p>01-4589134, 01-4588627, 9801644462</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center">
                  <Mail />
                </div>
                <div>
                  <a href="mailto:inquiry@texascollege.edu.np">
                    inquiry@texascollege.edu.np
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center">
                  <Clock />
                </div>
                <div>
                  <p>Opening Hour</p>
                  <p>06:00 AM - 06:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full gap-6 px-5 py-6 ">
            <div className="flex flex-col gap-5">
              <p className="font-bold tracking-wider">Links</p>
              <div className="flex flex-col gap-3 text-sm text-white ">
                <a
                  href="/"
                  className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
                >
                  Home
                </a>
                <a
                  href="/cart"
                  className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
                >
                  Cart
                </a>
                <a
                  href="/checkout"
                  className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
                >
                  Checkout
                </a>
                <a
                  href="/order"
                  className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
                >
                  Orders
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <p className="font-bold tracking-wider">Resources</p>
              <div className="flex flex-col gap-3 text-sm text-white">
                <a
                  href="/terms"
                  target="_blank"
                  className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
                >
                  Terms & Condition
                </a>
                <a
                  target="_blank"
                  href="/privacy"
                  className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full flex justify-between flex-col md:flex-row py-4 px-5 text-sm text-[var(--dark-secondary-text)] gap-3">
        <p>Copyright © 2024 All Rights Reserved.</p>
        <p className="cursor-pointer">
          Developed By:{" "}
          <a
            href=""
            target="_blank"
            className="hover:text-[var(--primary-color)]  hover:underline "
          >
            Saroj
          </a>{" "}
          and{" "}
          <a
            href="https://aayush-al.web.app/"
            target="_blank"
            className="hover:text-[var(--primary-color)]  hover:underline"
          >
            Aayush.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
