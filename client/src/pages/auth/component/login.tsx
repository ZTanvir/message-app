import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router";
import z from "zod";
import { cn } from "../../../utils/schemas/cn";
import { LoginValidationSchema as LoginFormSchema } from "@message-app/shared/zodSchemas/validationSchema";
import type { Banner } from "../../../types/componentTypes";
import { AlertMessage, SuccessMessage } from "../../../components/AlertBanner";
import authService from "../../../services/authService";
import Spinner from "../../../components/Spinner";
import PasswordInput from "../../../components/PasswordInput";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../../hooks/contextConsume";

type FormErrors = {
  email?: string[];
  password?: string[];
};
type ServerMessage = {
  message: string;
  type: Extract<Banner, "success" | "negative">;
};

export default function Login() {
  const [loginFormValues, setLoginFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<null | FormErrors>(null);
  const [serverMessage, setServerMessage] = useState<null | ServerMessage>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logIn } = useAuthContext();

  const handleLoginSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setFormErrors(null);
    setServerMessage(null);
    try {
      const result = LoginFormSchema.safeParse(loginFormValues);
      if (!result.success) {
        const formatErrors = z.flattenError(result.error);
        setFormErrors(formatErrors.fieldErrors);
        return;
      }

      const data = await authService.loginUser(result.data);

      if (!data.success) {
        // form field error
        if (data.error) {
          setFormErrors(data.details);
        } else {
          setServerMessage({ type: "negative", message: data.message });
        }
        return;
      }
      setServerMessage({ type: "success", message: data.message });
      logIn(data.user);

      const redirectTime = 2000;
      setTimeout(() => {
        navigate("/home");
      }, redirectTime);
    } catch (_error) {
      setServerMessage({
        type: "negative",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetMsg = () => {
    setServerMessage(null);
  };

  return (
    <section className="space-y-4 px-3">
      {serverMessage &&
        (serverMessage.type === "negative" ? (
          <AlertMessage
            handleResetMsg={handleResetMsg}
            message={serverMessage.message}
          />
        ) : (
          <SuccessMessage
            handleResetMsg={handleResetMsg}
            message={serverMessage?.message}
          />
        ))}
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
        <div className="relative flex flex-col gap-y-1">
          <label htmlFor="password">Password</label>
          <PasswordInput
            formErrors={formErrors}
            value={loginFormValues["password"]}
            setPassword={(value: string) =>
              setLoginFormValues((prev) => ({
                ...prev,
                password: value,
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
          className="flex items-center justify-center gap-x-2 rounded-lg bg-orange-600 p-2 font-bold text-white transition-colors duration-100 hover:cursor-pointer hover:bg-orange-500 focus:bg-orange-500"
          type="submit"
          formNoValidate
        >
          {isLoading && <Spinner />}
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
