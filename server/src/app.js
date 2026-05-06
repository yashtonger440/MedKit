import express from "express";
import cors from "cors";
import routes from "./routes/index.js"
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes  from "./routes/doctorRoutes.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));
app.use(express.json());
app.use("/api", routes);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);
app.use("/api", doctorRoutes);

app.get("/", (req,res) => {
    res.send("API Running");
});

export default app;