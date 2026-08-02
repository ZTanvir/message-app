import Login from "./component/login";
import appSampleImg from "../../assets/images/dashboard-messaging-4067c248.png";
import logImg from "../../../public/logo.png";

export default function AuthPage() {
  return (
    <main className="">
      <section>
        <h1 className="flex items-center gap-x-2 font-bold">
          <img src={logImg} alt="logo" />
          <span className="text-3xl">Odin Messaging App</span>
        </h1>
        <Login />
      </section>
      <img src={appSampleImg} alt="app sample" />
    </main>
  );
}
