const app = require('./app');
const port = 5000;//process.env.PORT || 5000;
app.listen(port);
console.log('Server listening at ',port);