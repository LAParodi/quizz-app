import { toast } from "react-hot-toast";
import { useCallback, useContext, useState } from "react";

import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import { getPollBookmarked } from "../../utils/helper";

import PollActions from "./PollActions";
import PollContent from "./PollContent";
import axiosInstance from "../../utils/axiosInstance";
import UserProfileInfo from "../cards/UserProfileInfo";
import PollingResultContent from "./PollingResultContent";

const PollCard = ({
  pollId,
  question,
  type,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  isMyPoll,
  isPollClosed,
  createdAt,
}) => {
  const { user, onUserVoted, toggleBookmarkId, onPollCreateOrDelete } =
    useContext(UserContext);

  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);

  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);

  const [pollResult, setPollResult] = useState({
    options,
    voters,
    responses,
  });

  const isPollBookmarked = getPollBookmarked(
    user.bookmarkedPolls || [],
    pollId
  );

  const [pollBookmarked, setPollBookMarked] = useState(isPollBookmarked);
  const [pollClosed, setPollClosed] = useState(isPollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);

  const handleInput = (value) => {
    if (type === "rating") setRating(value);
    else if (type === "open-ended") setUserResponse(value);
    else setSelectedOptionIndex(value);
  };

  const getPostData = useCallback(() => {
    if (type === "open-ended") {
      return { responseText: userResponse, voterId: user._id };
    }
    if (type === "rating") {
      return { optionIndex: rating - 1, voterId: user._id };
    }
    return { optionIndex: selectedOptionIndex, voterId: user._id };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POLLS.GET_BY_ID(pollId)
      );

      if (response.data) {
        const pollDetails = response.data;
        setPollResult({
          options: pollDetails.options || [],
          voters: pollDetails.voters.length || 0,
          responses: pollDetails.responses || [],
        });
      }
    } catch (error) {
      console.log(
        error.response?.data?.message || "Error al obtener detalles."
      );
    }
  };

  const handleVoteSubmit = async () => {
    try {
      await axiosInstance.post(API_PATHS.POLLS.VOTE(pollId), getPostData());

      getPollDetail();
      setIsVoteComplete(true);
      onUserVoted();
      toast.success("Voto realizado");
    } catch (error) {
      console.log(error.response?.data?.message || "Error al votar.");
    }
  };

  const toggleBookmark = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.BOOKMARK(pollId)
      );

      setPollBookMarked((prev) => !prev);
      toggleBookmarkId(pollId);
      toast.success(response.data.message);
    } catch (error) {
      console.log(
        error.response?.data?.message || "Error al guardar encuesta."
      );
    }
  };

  const closePoll = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId));

      if (response.data) {
        setPollClosed(true);
        toast.success(response.data?.message || "La encuesta ha cerrado.");
      }
    } catch (error) {
      console.log(
        error.response?.data?.message || "Error al cerrar la encuesta."
      );
    }
  };

  const deletePoll = async () => {
    try {
      const response = await axiosInstance.delete(
        API_PATHS.POLLS.DELETE(pollId)
      );

      if (response.data) {
        setPollDeleted(true);
        onPollCreateOrDelete("delete");
        toast.success(
          response.data?.message || "La encuesta ha sido eliminada."
        );
      }
    } catch (error) {
      console.log(
        error.response?.data?.message || "Error al eliminar la cuesta."
      );
    }
  };

  return (
    !pollDeleted && (
      <div className="bg-slate-100/50 my-5 p-5 rounded-lg border-slate-100 mx-auto">
        <div className="flex items-start justify-between">
          <UserProfileInfo
            imgUrl={creatorProfileImg}
            fullName={creatorName}
            username={creatorUsername}
            createdAt={createdAt}
          />

          <PollActions
            pollId={pollId}
            isVoteComplete={isVoteComplete}
            inputCaptured={
              !!(userResponse || selectedOptionIndex >= 0 || rating)
            }
            onVoteSubmit={handleVoteSubmit}
            isBookmarked={pollBookmarked}
            toggleBookmark={toggleBookmark}
            isMyPoll={isMyPoll}
            pollClosed={pollClosed}
            onClosePoll={closePoll}
            onDelete={deletePoll}
          />
        </div>

        <div className="ml-14 mt-3">
          <p className="text-[15px] text-black leading-8">{question}</p>
          <div className="mt-4">
            {isVoteComplete || isPollClosed ? (
              <PollingResultContent
                type={type}
                options={pollResult.options || []}
                voters={pollResult.voters}
                responses={pollResult.responses || []}
              />
            ) : (
              <PollContent
                type={type}
                options={options}
                selectedOptionIndex={selectedOptionIndex}
                onOptionSelect={handleInput}
                rating={rating}
                onRatingChange={handleInput}
                userResponse={userResponse}
                onResponseChange={handleInput}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default PollCard;
