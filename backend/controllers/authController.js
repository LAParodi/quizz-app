import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Poll from "../models/Poll.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Correo y contraseña son requeridos.",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(400)
        .json({ message: "Credenciales inválidas. Inténtelo de nuevo." });
    }

    const totalPollsBookmarked = user.bookmarkedPolls.length;
    const totalPollsVoted = await Poll.countDocuments({ voters: user._id });
    const totalPollsCreated = await Poll.countDocuments({ creator: user._id });

    res.status(200).json({
      id: user._id,
      user: {
        ...user.toObject(),
        totalPollsCreated,
        totalPollsVoted,
        totalPollsBookmarked,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al intentar iniciar sesión.",
      error: error.message,
    });
  }
};

export const registerUser = async (req, res) => {
  const { fullName, username, email, password, profileImageUrl } = req.body;
  if (!fullName || !username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son requeridos." });
  }

  const usernameRegex = /^[a-zA-Z0-9-]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Nombre de usuario inválido. Caráceteres alfanúmericos solamente.",
    });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso." });
    }

    const newUser = await User.create({
      fullName,
      username,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      id: newUser._id,
      newUser,
      token: generateToken(newUser._id),
      message: "Nuevo usuario creado.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear nuevo usuario.",
      error: error.message,
    });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const totalPollsBookmarked = user.bookmarkedPolls.length;
    const totalPollsVoted = await Poll.countDocuments({ voters: user._id });
    const totalPollsCreated = await Poll.countDocuments({ creator: user._id });

    const userInfo = {
      ...user.toObject(),
      totalPollsCreated,
      totalPollsVoted,
      totalPollsBookmarked,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los datos del usuario.",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await Poll.updateMany(
      { bookmarkedPolls: user._id },
      { $pull: { bookmarkedPolls: user._id } }
    );

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Usuario eliminado." });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar usuario.",
      error: error.message,
    });
  }
};
