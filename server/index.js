const express = require('express');
const app = express();
const neo4j = require('neo4j-driver');

const dotenv = require('dotenv');
const cors = require("cors");

const bodyParser = require('body-parser');
const users = require("./routes/users");
const auth = require("./routes/auth");
const funcs = require("./routes/funcs");
const experiences = require("./routes/experiences");
const jobs = require("./routes/jobs");

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

dotenv.config();


//*********** Neo4J Connection ***********/

// Load the routes
app.use("/api/users", users); 
app.use("/api/auth", auth); 
app.use("/api/functions", funcs); 
app.use("/api/experiences", experiences); 
app.use("/api/jobs", jobs); 
 

app.post("/",(req,res)=>{
  res.send({title:"Hello World",body:req.body});
});

//************* PORT ********************* */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening - http://localhost:${port}`);
});
