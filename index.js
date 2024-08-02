const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const productroutes = require("./routes/productRouter");
const tableroutes = require("./routes/tablesRouter.js");
const userroutes = require("./routes/userRouter.js");
const adminroutes = require("./routes/adminRouter.js");
const path = require("node:path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const port = 4000 || process.env.PORT;
app.listen(port, () => {
  console.log("server Started");
});
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose
  .connect(process.env.DB)
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));
app.use(express.static(path.join(__dirname, "/")));
app.use("/api", tableroutes);
app.use("/api", userroutes);
app.use("/api", productroutes);
app.use("/api", adminroutes);
