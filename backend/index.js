const express = require('express');
const app = express();
const port = 4001;
const cors = require('cors');

// CORS policy
const corsOptions = {
    origin: true,
    credentials: true,
};
  
app.use(cors(corsOptions));

app.use(express.json());

require("./model/userModel");
require("./model/taskModel");

require("./database/init");

app.use("/api/users", require("./routes/userRoute"));
app.use("/api/tasks", require("./routes/taskRoute"));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  
module.exports = app;