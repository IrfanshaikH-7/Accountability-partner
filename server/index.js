const app = require("./src/app");
const port = 3000;
const cors = require('cors')

app.use(cors)

app.listen(port, () => console.log("Example app listening on port 3000!"));