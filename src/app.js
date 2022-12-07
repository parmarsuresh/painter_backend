const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const r = require('./router/Pro');
app.use(r);



app.get("/jay", (req, res) => {
     res.send("i am add.js page");
});





app.listen(port, () => {
     console.log(`server is running on ${port}`);
})