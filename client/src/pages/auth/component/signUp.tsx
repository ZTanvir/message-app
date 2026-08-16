import { useState } from "react";
import { Link } from "react-router";
import z from "zod";
import { cn } from "../../../utils/schemas/cn";
import { SignUpValidationSchema as SignUpFormSchema } from "@message-app/shared/zodSchemas/validationSchema";
import authService from "../../../services/authService";
import { useNavigate } from "react-router";
import { AlertMessage, SuccessMessage } from "../../../components/AlertBanner";
import type { Banner } from "../../../types/componentTypes";
import Spinner from "../../../components/Spinner";

type FormErrors = {
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  password?: string[];
};

type ServerMessage = {
  message: string;
  type: Extract<Banner, "success" | "negative">;
};

export default function SignUp() {
  const [SignUpFormValues, setSignUpFromValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<null | FormErrors>(null);
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUpSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    const result = SignUpFormSchema.safeParse(SignUpFormValues);
    if (!result.success) {
      const formatErrors = z.flattenError(result.error);
      setFormErrors(formatErrors.fieldErrors);
      setServerMessage(null);
    } else {
      const data = await authService.addUser(result.data);
      if (!data.success) {
        // form field error
        if (data.error) {
          setFormErrors(data.details);
          return;
        }
        setServerMessage({ type: "negative", message: data.message });
        setFormErrors(null);
      } else {
        setFormErrors(null);
        setServerMessage({ type: "success", message: data.message });
        const redirectTime = 2000;
        setTimeout(() => {
          navigate("/");
        }, redirectTime);
      }
    }
    setIsLoading(false);
  };
  const handleResetMsg = () => {
    setServerMessage(null);
  };

  return (
    <form
      onSubmit={handleSignUpSubmit}
      id="signUpForm"
      className="flex flex-col gap-y-3 text-gray-800"
    >
      {serverMessage && serverMessage.type === "negative" ? (
        <AlertMessage
          handleResetMsg={handleResetMsg}
          message={serverMessage.message}
        />
      ) : (
        serverMessage?.message && (
          <SuccessMessage
            handleResetMsg={handleResetMsg}
            message={serverMessage?.message}
          />
        )
      )}
      <h2 className="text-3xl font-bold md:text-4xl">Sign up</h2>
      <p className="text-lg text-gray-400 md:text-xl">
        Already have an account?{" "}
        <Link className="font-bold text-orange-600" to={"/login"}>
          Login
        </Link>
      </p>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="f_name">First name</label>
        <input
          className={cn(
            "input-custom",
            formErrors?.first_name && "outline-1 outline-red-400",
          )}
          type="text"
          name="f_name"
          id="f_name"
          placeholder="Enter your first name"
          value={SignUpFormValues["first_name"]}
          onChange={(e) =>
            setSignUpFromValues((prev) => ({
              ...prev,
              first_name: e.target.value,
            }))
          }
        />
        {formErrors?.first_name?.map((err, index) => (
          <p className="text-md text-red-400" key={index}>
            {err}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="l_name">Last name</label>
        <input
          className={cn(
            "input-custom",
            formErrors?.last_name && "outline-1 outline-red-400",
          )}
          type="text"
          name="l_name"
          id="l_name"
          placeholder="Enter your last name"
          value={SignUpFormValues["last_name"]}
          onChange={(e) =>
            setSignUpFromValues((prev) => ({
              ...prev,
              last_name: e.target.value,
            }))
          }
        />
        {formErrors?.last_name?.map((err, index) => (
          <p className="text-md text-red-400" key={index}>
            {err}
          </p>
        ))}
      </div>

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
          value={SignUpFormValues["email"]}
          onChange={(e) =>
            setSignUpFromValues((prev) => ({
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
            formErrors?.password && "outline-1 outline-red-400",
          )}
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          value={SignUpFormValues["password"]}
          onChange={(e) =>
            setSignUpFromValues((prev) => ({
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
        className="flex items-center justify-center gap-x-2 rounded-lg bg-orange-600 p-2 font-bold text-white transition-colors duration-100 hover:cursor-pointer hover:bg-orange-500 focus:bg-orange-500"
        type="submit"
        formNoValidate
      >
        {isLoading && <Spinner />}
        Sign up
      </button>
    </form>
  );
}
