import { Outlet } from "react-router";
import appSampleImg from "../assets/images/dashboard-messaging-4067c248.png";
import logoImg from "../assets/images/logo.png";

export default function AuthLayout() {
  return (
    <main className="flex min-h-screen justify-center px-2 lg:justify-start lg:px-0">
      <section className="rounded-lg p-4 md:self-center md:border md:border-orange-600 md:p-12 md:shadow-md lg:min-w-1/3 lg:border-0 lg:py-0 lg:shadow-none">
        <h1 className="mt-2 mb-8 flex items-center gap-x-2 text-2xl font-bold md:text-3xl">
          <img src={logoImg} alt="logo" />
          <span>Odin Messaging App</span>
        </h1>
        {/* render SignUp or Login component */}
        <Outlet />
      </section>
      <div className="hidden lg:block lg:min-w-2/3">
        <img
          className="h-full w-full lg:object-cover xl:object-fill"
          src={appSampleImg}
          alt="app sample"
        />
      </div>
    </main>
  );
}
