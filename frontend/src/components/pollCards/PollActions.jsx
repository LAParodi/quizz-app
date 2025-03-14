import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const PollActions = ({
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  isMyPoll,
  pollClosed,
  onClosePoll,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleVoteClick = async () => {
    setLoading(true);

    try {
      await onVoteSubmit();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {(isVoteComplete || pollClosed) && (
        <div className="text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md">
          {pollClosed ? "Cerrado" : "Ya has votado"}
        </div>
      )}

      {isMyPoll && !pollClosed && (
        <button
          className="btn-small text-orange-500 bg-orange-500/20 transition-all hover:bg-orange-500 hover:text-white hover:border-none"
          onClick={onClosePoll}
          disabled={loading}
        >
          Cerrar
        </button>
      )}

      {isMyPoll && (
        <button
          className="btn-small text-red-500 bg-red-500/20 transition-all hover:bg-red-500 hover:text-white hover:border-none"
          onClick={onDelete}
          disabled={loading}
        >
          Eliminar
        </button>
      )}

      <button className="icon-btn" onClick={toggleBookmark}>
        {isBookmarked ? (
          <FaBookmark className="text-yellow-500" />
        ) : (
          <FaRegBookmark className="text-neutral-500" />
        )}
      </button>

      {inputCaptured && !isVoteComplete && (
        <button
          className="btn-small ml-auto"
          onClick={handleVoteClick}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      )}
    </div>
  );
};

export default PollActions;
