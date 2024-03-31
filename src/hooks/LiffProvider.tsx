import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Liff } from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";

const LiffContext = createContext<{
  liff: Liff | null;
  liffError: string | null;
}>({ liff: null, liffError: null });

export const useLiff = () => useContext(LiffContext);

export const LiffProvider: FC<PropsWithChildren<{ liffId: string }>> = ({
  children,
  liffId,
}) => {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  const initLiff = useCallback(async () => {
    try {
      const liffModule = await import("@line/liff");
      const liff = liffModule.default;

      if (process.env.NODE_ENV === "development") {
        liff.use(new LiffMockPlugin());
        // @ts-ignore
        await liff.init({ liffId, mock: true });
        liff.login();
      } else {
        await liff.init({ liffId });
      }
      setLiff(liff);
    } catch (error) {
      setLiffError((error as Error).toString());
    }
  }, [liffId]);

  useEffect(() => {
    console.log("LIFF init start...");
    initLiff();
  }, [initLiff]);

  return (
    <LiffContext.Provider
      value={{
        liff,
        liffError,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};
