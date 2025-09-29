"use client"
import React, { createContext, useState } from "react";

interface RoleContextType {
  role: string | null;
  setRole: (role: string | null) => void;
}

export const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

