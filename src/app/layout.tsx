import { ToastContainer } from "react-toastify";
import "./globals.css";
import { Providers } from "@/store/Providers";
import Navbar from "@/componentes/Navbar";
import { RoleProvider } from "@/lib/contex/roleContext";
// import { ProductContextProvider } from "@/context/ProductContect";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true" className=" bg-[#FDFEF9] px-5  w-full relative">
        <RoleProvider>
          <Providers>
            <Navbar />
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </Providers>
        </RoleProvider>
      </body>
    </html>
  );
}
