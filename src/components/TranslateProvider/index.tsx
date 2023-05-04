import { createContext, useContext, useEffect, useState } from "react";

interface TranslateCreateContext {
  t: (key: string) => string;
  setLang: (lang: string) => void;
  lang: string;
}

interface GlobalType {
  t?: (key: string) => string;
}
interface Translate {
  [key: string]: { [key: string]: string };
}

interface PropsTypes<T extends Translate> {
  children: React.ReactNode;
  translate: T;
  defaultLang: keyof T;
}

const Context = createContext<TranslateCreateContext>({
  t: () => "",
  setLang: () => "",
  lang: "",
});

// eslint-disable-next-line react-refresh/only-export-components
export const t = (key: string) => {
  return global.t?.(key);
};

const global: GlobalType = {};

const TranslateProvider = <T extends Translate>({
  children,
  translate,
  defaultLang,
}: PropsTypes<T>) => {
  const [lang, setLang] = useState(() =>
    JSON.parse(localStorage.getItem("lang") || JSON.stringify(defaultLang))
  );

  const _t = (key: string) => {
    return translate?.[lang]?.[key] || key;
  };

  useEffect(() => {
    global.t = _t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("lang", JSON.stringify(lang));
  }, [lang]);

  return (
    <Context.Provider value={{ t: _t, setLang, lang }}>
      {children}
    </Context.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTranslate = () => {
  const context = useContext(Context);

  if (typeof context === "undefined")
    throw new Error("The Component must be consumped within TranslateProvider");

  return context;
};

export default TranslateProvider;

// import { Translate } from "@/config";
// import { createContext, useContext, useEffect, useState } from "react";

// type Lang = keyof Translate;

// interface IPropsTypes<T extends Lang> {
//   children: React.ReactNode;
//   translate: Translate;
//   defaultLang: T;
// }

// interface ITranslateCreateContext {
//   t: (key: string) => string;
//   setLang: React.Dispatch<React.SetStateAction<Lang>>;
//   lang: Lang;
// }
// interface GlobalTYpe {
//   t?: (key: string) => string;
// }
// const Context = createContext<ITranslateCreateContext>({
//   t: () => "",
//   setLang: () => "",
//   lang: "chi",
// });

// // eslint-disable-next-line react-refresh/only-export-components
// export const t = (key: string) => {
//   return global.t?.(key);
// };

// const global: GlobalTYpe = {};

// const TranslateProvider = <T extends Lang>({
//   children,
//   translate,
//   defaultLang,
// }: IPropsTypes<T>) => {
//   const [lang, setLang] = useState<keyof typeof translate>(() =>
//     JSON.parse(localStorage.getItem("lang") || JSON.stringify(defaultLang))
//   );

//   const _t = (key: string) => {
//     return translate?.[lang]?.[key as keyof Translate[Lang]] || key;
//   };

//   useEffect(() => {
//     global.t = _t;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [lang]);

//   useEffect(() => {
//     localStorage.setItem("lang", JSON.stringify(lang));
//   }, [lang]);

//   return (
//     <Context.Provider value={{ t: _t, setLang, lang }}>
//       {children}
//     </Context.Provider>
//   );
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useTranslate = () => {
//   const context = useContext(Context);

//   if (typeof context === "undefined")
//     throw new Error("The Component must be consumped within TranslateProvider");

//   return context;
// };

// export default TranslateProvider;
