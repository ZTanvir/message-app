import { useState } from "react";
import { Link } from "react-router";
import z from "zod";
import { cn } from "../../../utils/schemas/cn";
import { SignUpValidationSchema as SignUpFormSchema } from "@message-app/shared/zodSchemas/validationSchema";

type FormErrors = {
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  password?: string[];
};

export default function SignUp() {
  const [SignUpFormValues, setSignUpFromValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<null | FormErrors>(null);

  const handleSignUpSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = SignUpFormSchema.safeParse(SignUpFormValues);
    if (!result.success) {
      const formatErrors = z.flattenError(result.error);
      setFormErrors(formatErrors.fieldErrors);
    } else {
      setFormErrors(null);
      console.log(result.data);
    }
  };

  return (
    <form
      onSubmit={handleSignUpSubmit}
      id="signUpForm"
      className="flex flex-col gap-y-3 text-gray-800"
    >
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
        className="rounded-lg bg-orange-600 p-2 font-bold text-white transition-colors duration-100 hover:cursor-pointer hover:bg-orange-500 focus:bg-orange-500"
        type="submit"
        formNoValidate
      >
        Sign up
      </button>
    </form>
  );
}
