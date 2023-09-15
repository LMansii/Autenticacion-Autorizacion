import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
