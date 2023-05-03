import { Rules, validate } from "@/utils";
import { useEffect, useRef, useState } from "react";

interface InitialDependency<Key> {
  initialValue: { [key: string]: any };
  dependencies: { [key: string]: Key[] };
}

interface Form {
  [key: string]: any;
}

export const useForm = <K extends keyof Form>(
  rules: Rules,
  { initialValue = {}, dependencies = {} }: InitialDependency<K>
) => {
  //   dependencies: {
  // password: ["confirmPassword"],
  // },
  const [form, setForm] = useState<Form>(initialValue);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setForm(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialValue)]);

  const formRef = useRef<HTMLFormElement>(null);
  const register = (name: string) => {
    return {
      error: errors?.[name] || "",
      value: form?.[name] || "",
      id: name,
      name,
      onChange: (value: string | boolean) => {
        const _form: { [x: string]: string | boolean } = {
          ...form,
          [name]: value,
        }; //cập nhật giá trị mới nhất
        if (Array.isArray(rules[name]) && rules[name].length > 0) {
          const errObj: { [key: string]: string } = {};

          //tạo error mới
          errObj[name] = validate({ [name]: rules[name] }, _form)[name];
          // Sử dụng 1 trong 2
          // ====== 1)validate trong lúc nhập data ======
          setErrors((errors) => ({ ...errors, [name]: errObj[name] }));
          if (
            typeof _form[name] === "string" &&
            !_form[name].toString().trim()
          ) {
            setErrors((error) => ({ ...error, [name]: "" }));
          } // khi xóa thì tắt validate

          // ====== 2) mất lỗi khi nhập ======
          // setErrors((error) => ({ ...error, [name]: "" })); //mất error khi nhập

          // ===== validate field phụ thuộc =====
          if (
            Array.isArray(dependencies[name]) &&
            dependencies[name].length > 0
          ) {
            for (const dependency of dependencies[name]) {
              // ===== validate lúc đang nhập data =====
              if (
                typeof _form[dependency] &&
                _form[dependency]?.toString().trim()
              ) {
                //===chỉ validate khi có dữ liệu===
                errObj[dependency] = validate(
                  { [dependency]: rules[dependency] },
                  _form
                )[dependency];
                setErrors((error) => ({
                  ...error,
                  [dependency]: errObj[dependency],
                }));
              }
            }
          }
        }
        setForm((form) => ({ ...form, [name]: value }));
      },
    };
  };

  const _validate = () => {
    const errorObject = validate(rules, form);
    if (errorObject) {
      setErrors(errorObject);
      if (formRef.current && Object.keys(errorObject).length > 0) {
        const fieldName = Object.keys(errorObject);
        const input = formRef?.current?.querySelector(
          `input[name=${fieldName[0]}]`
        ) as HTMLInputElement;
        input.focus();
      }

      return Object.keys(errorObject).length === 0;
    }
  };

  const reset = () => {
    setForm({});
  };

  return {
    form,
    errors,
    register,
    validate: _validate,
    reset,
    formRef,
    setForm,
  };
};
