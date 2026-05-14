import express from "express";
import cors from "cors";
import routes from "./routes/index.js"
import doctorRoutes from "./routes/doctorRoutes.js";
import technicianRoutes from "./routes/technician.routes.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));
app.use(express.json());

app.use("/api", routes);                      // auth + booking + admin routes
app.use("/api", doctorRoutes);
app.use("/api/technician", technicianRoutes); // Technician routes

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => res.send("API Running"));

export default app;