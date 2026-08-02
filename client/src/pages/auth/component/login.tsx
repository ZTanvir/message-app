export default function Login() {
  return (
    <section className="space-y-2 px-3">
      <h2 className="text-4xl font-bold">Welcome back</h2>
      <p className="text-xl">New to Odin Messaging App? Create an account</p>
      <form className="flex flex-col gap-y-2">
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            className="rounded-lg border border-gray-200 px-2 py-1 focus:outline-1 focus:outline-gray-400"
            type="email"
            name="email"
            id="email"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            className="rounded-lg border border-gray-200 px-2 py-1 focus:outline-1 focus:outline-gray-400"
            type="password"
            name="password"
            id="password"
          />
        </div>
        <button className="" type="submit">
          Log in
        </button>
        <button type="button">Try a demo account</button>
      </form>
    </section>
  );
}
