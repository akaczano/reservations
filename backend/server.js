const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const { port, mongoURI } =  require('./config/keys');

const app = express();

app.use(cors())
app.use(express.json());

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => {
		console.log('MongoDB successfully connected');	
	})
	.catch(err => {
		console.log(err);
	});

app.use('/api/masses', require('./routes/masses'));
app.use('/api/auth', require('./routes/users'));
app.use('/api/config', require('./routes/config'));
app.use('/api/weeklymass', require('./routes/weeklymass'));
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
})
