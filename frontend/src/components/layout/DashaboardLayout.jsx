import { useContext } from "react";

import { UserContext } from "../../context/UserContext";

import Stats from "./Stats";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import UserDetailsCard from "../cards/UserDetailsCard";

const DashboardLayout = ({ children, activeMenu, stats, showStats }) => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">{children}</div>

          <div className="hidden md:block mr-5">
            <UserDetailsCard
              profileImageUrl={user && user.profileImageUrl}
              fullName={user && user.fullName}
              username={user && user.username}
              totalPollsVoted={user && user.totalPollsVoted}
              totalPollsCreated={user && user.totalPollsCreated}
              totalPollsBookmarked={user && user.totalPollsBookmarked}
            />

            {showStats && stats?.length > 0 && <Stats stats={stats} />}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
