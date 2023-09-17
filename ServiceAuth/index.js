import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3001;
//impoted routes
import users from "./src/routes/userRoutes.js";
import role from "./src/routes/roleRoutes.js"
import permission from "./src/routes/permissionRoutes.js"
//Configuration express
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

//Routes
//------------- Users -------------
app.use(`/api/${process.env.VERSION_API}`, users)
//------------- Roles -------------
app.use(`/api/${process.env.VERSION_API}`, role)
//------------- Permission -------------
app.use(`/api/${process.env.VERSION_API}`, permission)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
