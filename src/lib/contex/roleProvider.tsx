import { RoleProvider } from "./roleContext";

export const roleProvider = ({ children }: { children: React.ReactNode }) => {
  <RoleProvider>{children}</RoleProvider>;
};
