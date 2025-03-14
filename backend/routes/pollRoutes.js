import express from "express";

import {
  closePoll,
  createPoll,
  voteOnPoll,
  deletePoll,
  getAllPolls,
  getPollById,
  bookmarkPoll,
  getVotedPolls,
  getBookmarkedPolls,
} from "../controllers/pollController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/user/bookmarked", protect, getBookmarkedPolls);
router.get("/user/votedPolls", protect, getVotedPolls);

router.get("/", protect, getAllPolls);
router.post("/", protect, createPoll);
router.get("/:id", protect, getPollById);
router.post("/:id/vote", protect, voteOnPoll);
router.post("/:id/close", protect, closePoll);
router.delete("/:id/delete", protect, deletePoll);
router.post("/:id/bookmark", protect, bookmarkPoll);

export default router;
