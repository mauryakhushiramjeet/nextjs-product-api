import Navbar from "@/componentes/Navbar";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
     {children}
    </>
  );
}
