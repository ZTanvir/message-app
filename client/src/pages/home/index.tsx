import { Routes, Route } from "react-router";
import Chat from "./components/Chat";
import Conversation from "./components/Conversation";
export default function HomePage() {
  return (
    <div className="">
      <h1>home message</h1>
      <Conversation />
      <Routes>
        <Route path=":id" element={<Chat />} />
      </Routes>
    </div>
  );
}
