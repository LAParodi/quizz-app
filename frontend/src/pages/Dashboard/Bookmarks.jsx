import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

import useUserAuth from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import EmptyCard from "../../components/cards/EmptyCard";
import PollCard from "../../components/pollCards/PollCard";
import DashboardLayout from "../../components/layout/DashaboardLayout";

import createIcon from "../../assets/images/createIcon.svg";

const Bookmarks = () => {
  useUserAuth();

  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [bookmarkedPolls, setBookmarkedPolls] = useState([]);

  const fetchBookmarkedPolls = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BOOKMARKED);

      if (response.data?.bookmarkedPolls?.length > 0) {
        setBookmarkedPolls((prevPolls) => [
          ...prevPolls,
          ...response.data.bookmarkedPolls,
        ]);
      }
    } catch (error) {
      console.log("Algo salió mal. Intenta de nuevo.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedPolls();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Favoritos">
      <div className="my-5 mx-auto">
        <h2 className="text-xl font-medium text-black">Encuestas guardadas</h2>

        {bookmarkedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={createIcon}
            message="No tienes ninguna pregunta como favorito."
            btnText="¿Deseas guardar una?"
            onClick={() => navigate("/dashboard")}
          />
        )}

        {bookmarkedPolls.map((poll, index) => {
          if (!user?.bookmarkedPolls?.includes(poll._id)) return null;

          return (
            <PollCard
              key={`dashboard_${poll._id}_${index}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters.length || 0}
              responses={poll.responses || []}
              creatorProfileImg={poll.creator.profileImageUrl || null}
              creatorName={poll.creator.fullName}
              creatorUsername={poll.creator.username}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt || false}
            />
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Bookmarks;
