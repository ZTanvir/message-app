export default function SignUp() {
  return (
    <form id="signUpForm" className="flex flex-col gap-y-3 text-gray-800">
      <h2 className="text-4xl font-bold">Sign up</h2>
      <p className="text-xl text-gray-800">Already have an account? Login</p>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="f_name">First name</label>
        <input
          className="h-10 rounded-lg border border-gray-200 px-2 py-1 focus:outline-1 focus:outline-gray-400"
          type="text"
          name="f_name"
          id="f_name"
          placeholder="Enter your first name"
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="l_name">Email</label>
        <input
          className="input-custom"
          type="text"
          name="l_name"
          id="l_name"
          placeholder="Enter your last name"
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="email">Email</label>
        <input
          className="input-custom"
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="password">Password</label>
        <input
          className="input-custom"
          type="password"
          name="password"
          id="password"
        />
      </div>
      <button
        className="rounded-lg bg-orange-600 p-2 font-bold text-white transition-colors duration-100 hover:cursor-pointer hover:bg-orange-500 focus:bg-orange-500"
        type="submit"
      >
        Sign up
      </button>
    </form>
  );
}
