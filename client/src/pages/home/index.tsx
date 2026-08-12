import viteEnv from "../../../env";
export default function HomePage() {
  return (
    <div>
      <button
        onClick={async () => {
          const res = await fetch(`${viteEnv.VITE_API_URL}`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          console.log("access", data);
        }}
      >
        Check access
      </button>
    </div>
  );
}
