import app from "./app.ts";
import env from "../env.ts";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
