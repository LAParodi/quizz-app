import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});

    console.log("Conectado a la base de datos MongoDB.");
  } catch (error) {
    console.error(
      "Hubo un error al intentar conectarse a la base de datos MongoDB.",
      error
    );
    process.exit(1);
  }
};

export default connectDB;
