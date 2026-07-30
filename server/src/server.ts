import app from "./app.ts";
import config from "./utils/configuration.ts";

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
