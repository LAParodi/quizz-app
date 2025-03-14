import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_PATHS } from "../../utils/apiPaths";

import useUserAuth from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import EmptyCard from "../../components/cards/EmptyCard";
import PollCard from "../../components/pollCards/PollCard";
import DashboardLayout from "../../components/layout/DashaboardLayout";

import createIcon from "../../assets/images/createIcon.svg";

const VotedPolls = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [votedPolls, setVotedPolls] = useState([]);

  const fetchAllVotedPolls = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.VOTED_POLLS);

      if (response.data?.polls?.length > 0) {
        setVotedPolls((prevPolls) => [...prevPolls, ...response.data.polls  ]);
      }
    } catch (error) {
      console.log("Algo salió mal. Intenta de nuevo.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVotedPolls();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Respondidas">
      <div className="my-5 mx-auto">
        <h2 className="text-xl font-medium text-black">
          Encuestas respondidas
        </h2>

        {votedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={createIcon}
            message="No has respondido ninguna pregunta."
            btnText="¿Deseas responder una?"
            onClick={() => navigate("/dashboard")}
          />
        )}

        {votedPolls.map((poll, index) => (
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
        ))}
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;
