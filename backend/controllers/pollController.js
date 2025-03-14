import mongoose from "mongoose";

import User from "../models/User.js";
import Poll from "../models/Poll.js";

export const createPoll = async (req, res) => {
  const { question, type, options, creatorId } = req.body;
  if (!question || !type || !creatorId) {
    return res.status(400).json({
      message:
        "Pregunta, tipo de pregunta e usuario autenticado son requeridos.",
    });
  }

  try {
    let processedOptions = [];
    switch (type) {
      case "single-choice":
        if (!options || options.length < 2) {
          return res.status(400).json({
            message: "El tipo de encuesta debe tener al menos 2 opciones.",
          });
        }
        processedOptions = options.map((option) => ({ optionText: option }));
        break;
      case "rating":
        processedOptions = [1, 2, 3, 4, 5].map((value) => ({
          optionText: value.toString(),
        }));
        break;
      case "yes/no":
        processedOptions = ["Sí", "No"].map((option) => ({
          optionText: option,
        }));
        break;
      case "image-based":
        if (!options || options.length < 2) {
          return res.status(400).json({
            message: "El tipo de encuesta debe tener al menos 2 opciones.",
          });
        }
        processedOptions = options.map((url) => ({ optionText: url }));
        break;
      case "open-ended":
        processedOptions = [];
        break;
      default:
        return res.status(400).json({ message: "Opción inválida." });
    }

    const newPoll = await Poll.create({
      question,
      type,
      options: processedOptions,
      creator: creatorId,
    });

    res.status(201).json(newPoll);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear encuesta.",
      error: error.message,
    });
  }
};

export const closePoll = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: "Encuesta no encontrada." });
    }

    if (poll.creator.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Acción no autorizada. No eres el propietario." });
    }

    poll.closed = true;
    await poll.save();

    res.status(201).json({ message: "Encuesta cerrada.", poll });
  } catch (error) {
    res.status(500).json({
      message: "Error al cerrar encuesta.",
      error: error.message,
    });
  }
};

export const voteOnPoll = async (req, res) => {
  const { id } = req.params;
  const { optionIndex, voterId, responseText } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(voterId)) {
      return res.status(400).json({ message: "ID de usuario inválido." });
    }

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: "Encuesta no encontrada." });
    }

    if (poll.closed) {
      return res.status(400).json({ message: "La encuesta ha terminado." });
    }

    if (poll.voters.includes(voterId)) {
      return res.status(400).json({ message: "¡Ya has votado!" });
    }

    if (poll.type === "open-ended") {
      if (!responseText) {
        return res.status(400).json({
          message: "Debes ingresar una respuesta para este tipo de encuesta.",
        });
      }
      poll.responses.push({ voterId, responseText });
    } else {
      if (
        optionIndex === undefined ||
        optionIndex < 0 ||
        optionIndex >= poll.options.length
      ) {
        return res.status(400).json({ message: "Opción inválida." });
      }
      poll.options[optionIndex].votes += 1;
    }

    poll.voters.push(voterId);
    await poll.save();

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({
      message: "Error al enviar voto.",
      error: error.message,
    });
  }
};

export const deletePoll = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ message: "Encuesta no encontrada." });
    }

    if (poll.creator.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Acción no autorizada. No eres el propietario." });
    }
    
    await User.updateMany(
      { bookmarkedPolls: id },
      { $pull: { bookmarkedPolls: id } }
    );

    await Poll.findByIdAndDelete(id);

    res.status(200).json({ message: "Encuesta eliminada." });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar encuesta.",
      error: error.message,
    });
  }
};

export const getPollById = async (req, res) => {
  const { id } = req.params;

  try {
    const poll = await Poll.findById(id)
      .populate("creator", "username email")
      .populate({
        path: "responses.voterId",
        select: "username profileImageUrl fullName",
      });
    if (!poll) {
      return res
        .status(404)
        .json({ message: "No se ha encontrado la encuesta." });
    }

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({
      message: "Error al cargar encuesta.",
      error: error.message,
    });
  }
};

export const getAllPolls = async (req, res) => {
  const { type, creatorId, page = 1, limit = 10 } = req.query;
  const filter = {};
  const userId = req.user._id;

  if (type) filter.type = type;
  if (creatorId) filter.creator = creatorId;

  try {
    const pageSize = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);
    const skip = (pageNumber - 1) * pageSize;

    const polls = await Poll.find(filter)
      .populate("creator", "fullName username email profileImageUrl")
      .populate({
        path: "responses.voterId",
        select: "fullName username profileImageUrl",
      })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const updatedPolls = polls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );
      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    const totalPolls = await Poll.countDocuments(filter);

    const stats = await Poll.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const allTypes = [
      { type: "yes/no", label: "Sí/No" },
      { type: "rating", label: "Rating" },
      { type: "open-ended", label: "Respuesta única" },
      { type: "single-choice", label: "Elección única" },
      { type: "image-based", label: "Banco de imágenes" },
    ];

    const statsWithDefaults = allTypes
      .map((pollType) => {
        const stat = stats.find((item) => item.type === pollType.type);
        return {
          type: pollType.type,
          label: pollType.label,
          count: stat ? stat.count : 0,
        };
      })
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalPolls / pageSize),
      totalPolls,
      stats: statsWithDefaults,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener todas las encuentas.",
      error: error.message,
    });
  }
};

export const bookmarkPoll = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const isBookmarked = user.bookmarkedPolls.includes(id);
    if (isBookmarked) {
      user.bookmarkedPolls = user.bookmarkedPolls.filter(
        (pollId) => pollId.toString() !== id
      );
      await user.save();

      return res.status(200).json({
        message: "Encuesta removida de favoritos.",
        bookmarkedPolls: user.bookmarkedPolls,
      });
    }

    user.bookmarkedPolls.push(id);
    await user.save();

    return res.status(200).json({
      message: "Encuesta añadida a favoritos.",
      bookmarkedPoll: user.bookmarkedPolls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al guardar la encuenta.",
      error: error.message,
    });
  }
};

export const getVotedPolls = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  try {
    const pageSize = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10);
    const skip = (pageNumber - 1) * pageSize;

    const polls = await Poll.find({ voters: userId })
      .populate("creator", "fullName profileImageUrl username email")
      .populate({
        path: "responses.voterId",
        select: "fullName username profileImageUrl",
      })
      .skip(skip)
      .limit(pageSize);

    const updatedPolls = polls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );
      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    const totalVotedPolls = await Poll.countDocuments({ voters: userId });

    res.status(200).json({
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalVotedPolls / pageSize),
      totalVotedPolls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener todas las encuestas.",
      error: error.message,
    });
  }
};

export const getBookmarkedPolls = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate({
      path: "bookmarkedPolls",
      populate: [
        {
          path: "creator",
          select: "fullName username profileImageUrl",
        },
        {
          path: "responses.voterId",
          select: "fullName username profileImageUrl",
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const bookmarkedPolls = user.bookmarkedPolls;

    const updatedPolls = bookmarkedPolls.map((poll) => {
      const userHasVoted = poll.voters.some((voterId) =>
        voterId.equals(userId)
      );
      return {
        ...poll.toObject(),
        userHasVoted,
      };
    });

    return res.status(200).json({
      bookmarkedPolls: updatedPolls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las encuestas favoritas.",
      error: error.message,
    });
  }
};
