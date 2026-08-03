import { Outlet } from "react-router";
import appSampleImg from "../assets/images/dashboard-messaging-4067c248.png";
import logoImg from "../../public/logo.png";

export default function AuthLayout() {
  return (
    <main className="flex min-h-screen justify-center lg:justify-start">
      <section className="self-center rounded-lg border border-orange-600 p-12 shadow-md lg:min-w-1/3 lg:border-0 lg:py-0 lg:shadow-none">
        <h1 className="mb-8 flex items-center gap-x-2 font-bold">
          <img src={logoImg} alt="logo" />
          <span className="text-3xl">Odin Messaging App</span>
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
