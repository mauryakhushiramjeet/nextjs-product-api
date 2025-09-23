import { ToastContainer } from "react-toastify";
import "./globals.css";
import { Providers } from "@/store/Providers";
import { SessionWrapper } from "@/SessionWrapper";
import Navbar from "@/componentes/Navbar";
// import { ProductContextProvider } from "@/context/ProductContect";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body cz-shortcut-listen="true" className=" bg-[#FDFEF9] px-5  w-full">
          <Providers>
              <Navbar />
              {children}

              <ToastContainer position="top-right" autoClose={3000} />
          </Providers>
        </body>
      </SessionWrapper>
    </html>
  );
}
