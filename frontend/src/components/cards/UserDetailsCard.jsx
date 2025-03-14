const StatsInfo = ({ label, value }) => {
  return (
    <div className="text-center">
      <p className="font-medium text-gray-950">{value}</p>
      <p className="text-xs text-neutral-700/80 mt-[2px]">{label}</p>
    </div>
  );
};

const UserDetailsCard = ({
  profileImageUrl,
  fullName,
  username,
  totalPollsVoted,
  totalPollsCreated,
  totalPollsBookmarked,
}) => {
  return (
    <div className="bg-slate-100/50 rounded-lg my-5 overflow-hidden">
      <div className="w-full h-24 bg-neutral-900 bg-cover flex justify-center relative">
        <div className="absolute -bottom-10 rounded-full overflow-hidden border-2 border-white">
          {profileImageUrl ? (
            <img
              src={profileImageUrl || ""}
              alt={fullName}
              className="w-20 h-20 bg-neutral-500 rounded-full"
            />
          ) : (
            <img
              src={"./images/no-avatar.png"}
              alt={"No avatar"}
              className="w-20 h-20 bg-neutral-500 rounded-full"
            />
          )}
        </div>
      </div>

      <div className="mt-12 px-5">
        <div className="text-center pt-1">
          <h5 className="text-lg text-neutral-950 font-medium leading-6">
            {fullName}
          </h5>
          <span className="text-[13px] font-medium text-neutral-700/60">
            @{username}
          </span>
        </div>

        <div className="flex items-center justify-center gap-5 flex-wrap my-6">
          <StatsInfo label="Mis encuestas" value={totalPollsCreated || 0} />
          <StatsInfo label="Respondidas" value={totalPollsVoted || 0} />
          <StatsInfo label="Favoritos" value={totalPollsBookmarked || 0} />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
