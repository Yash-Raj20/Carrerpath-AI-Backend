import { connect } from 'mongoose';
const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection error', err);
    process.exit(1);
  }
};
export default connectDB;