import Button from "./components/Button";
import { useTranslate } from "./components/TranslateProvider";
const App = () => {
  const { t } = useTranslate();
  return (
    <div className="">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button />
      <p>{t("Điện thoại")}</p>
    </div>
  );
};

export default App;
