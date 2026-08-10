import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router";
import z from "zod";
import { cn } from "../../../utils/schemas/cn";
import { LoginValidationSchema as LoginFormSchema } from "@message-app/shared/zodSchemas/validationSchema";

type FormErrors = {
  email?: string[];
  password?: string[];
};

export default function Login() {
  const [loginFormValues, setLoginFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<null | FormErrors>(null);

  const handleLoginSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = LoginFormSchema.safeParse(loginFormValues);
    if (!result.success) {
      const formatErrors = z.flattenError(result.error);
      setFormErrors(formatErrors.fieldErrors);
    } else {
      setFormErrors(null);
      console.log(result.data);
    }
  };

  return (
    <section className="space-y-4 px-3">
      <h2 className="text-3xl font-bold md:text-4xl">Welcome back</h2>
      <p className="text-lg text-gray-400 md:text-xl">
        New to Odin Messaging App?{" "}
        <Link className="font-bold text-orange-600" to={"/signup"}>
          Create an account
        </Link>
      </p>
      <form
        onSubmit={handleLoginSubmit}
        id="loginForm"
        className="flex flex-col gap-y-3 text-gray-800"
      >
        <div className="flex flex-col gap-y-1">
          <label htmlFor="email">Email</label>
          <input
            className={cn(
              "input-custom",
              formErrors?.email && "outline-1 outline-red-400",
            )}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={loginFormValues.email}
            onChange={(e) =>
              setLoginFormValues((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          {formErrors?.email?.map((err, index) => (
            <p className="text-md text-red-400" key={index}>
              {err}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="password">Password</label>
          <input
            className={cn(
              "input-custom",
              formErrors?.email && "outline-1 outline-red-400",
            )}
            type="password"
            name="password"
            id="password"
            value={loginFormValues.password}
            onChange={(e) =>
              setLoginFormValues((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          {formErrors?.password?.map((err, index) => (
            <p className="text-md text-red-400" key={index}>
              {err}
            </p>
          ))}
        </div>
        <button
          className="rounded-lg bg-orange-600 p-2 font-bold text-white transition-colors duration-100 hover:cursor-pointer hover:bg-orange-500 focus:bg-orange-500"
          type="submit"
          formNoValidate
        >
          Log in
        </button>
        <button
          className="group flex justify-center gap-1 rounded-lg border border-orange-600 p-2 transition-colors duration-100 hover:cursor-pointer hover:border-white hover:bg-orange-400 hover:text-white focus:bg-orange-400 focus:text-white"
          type="button"
        >
          <UserCircleIcon className="size-6 text-orange-600 transition-colors duration-100 group-hover:text-white group-focus:text-white" />
          <span>Try a demo account</span>
        </button>
      </form>
    </section>
  );
}
