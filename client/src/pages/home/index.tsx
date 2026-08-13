import viteEnv from "../../../env";
export default function HomePage() {
  return (
    <div>
      <button
        onClick={async () => {
          const res = await fetch(`${viteEnv.VITE_API_URL}/api/auth/check`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          console.log("access", res);
          const data = await res.json();
          console.log("access", data);
        }}
      >
        Check access
      </button>
    </div>
  );
}
