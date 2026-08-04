import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router";

export default function Login() {
  const [loginFormValues, setLoginFormValues] = useState({
    email: "",
    password: "",
  });
  const handleLoginSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
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
            className="input-custom"
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
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="password">Password</label>
          <input
            className="input-custom"
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
        </div>
        <button
          className="rounded-lg bg-orange-600 p-2 font-bold text-white transition-colors duration-100 hover:cursor-pointer hover:bg-orange-500 focus:bg-orange-500"
          type="submit"
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
      <p>{JSON.stringify(loginFormValues)}</p>
    </section>
  );
}
