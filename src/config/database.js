import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://fabiobianchi:Ocasa2009@cluster0.dx5auig.mongodb.net/BackendII?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;