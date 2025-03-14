import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";

import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

import Stats from "../../components/layout/Stats";
import useUserAuth from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import EmptyCard from "../../components/cards/EmptyCard";
import PollCard from "../../components/pollCards/PollCard";
import DashboardLayout from "../../components/layout/DashaboardLayout";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter";

import createIcon from "../../assets/images/createIcon.svg";

const PAGE_SIZE = 5;

const MyPolls = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [stats, setStats] = useState([]);
  const [allPolls, setAllPolls] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [filterType, setFilterType] = useState("");

  const fetchAllPolls = async (overridePage = page) => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      );

      if (response.data?.polls?.length > 0) {
        setAllPolls((prevPolls) =>
          overridePage === 1
            ? response.data.polls
            : [...prevPolls, ...response.data.polls]
        );
        setStats(response.data?.stats || []);
        setHasMore(response.data?.polls?.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);

    return () => {};
  }, [filterType, user]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }

    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu={"Mis encuestas"} stats={stats || []} showStats>
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="Mis encuestas"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {allPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={createIcon}
            message="No tienes encuestras creadas."
            btnText="¿Deseas crear una?"
            onClick={() => navigate("/create-poll")}
          />
        )}

        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text">Cargando...</h4>}
          endMessage={<p className="info-text">No hay más encuestras</p>}
        >
          {allPolls.map((poll) => (
            <PollCard
              key={`dashboard_${poll._id}`}
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
              isMyPoll
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default MyPolls;
