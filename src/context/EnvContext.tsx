import { createContext } from 'react';

type EnvContextType = {
  PWD?: string;
  OLDPWD?: string;
} & Record<string, string>;

export const EnvContext = createContext<EnvContextType>({});
