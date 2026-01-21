import app from "./app.js";
import { Config } from "./config/config.js";

app.listen(Config.PORT, () => {
  console.log(`Server is running on PORT: ${Config.PORT}`);
});
