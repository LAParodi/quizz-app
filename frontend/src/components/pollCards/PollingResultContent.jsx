import { convertDate } from "../../utils/helper";

const PollOptionVoteResult = ({ label, optionVotes, totalVotes }) => {
  const progress =
    totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

  return (
    <div className="w-full bg-neutral-200/80 rounded-md h-6 relative mb-3">
      <div
        className="bg-neutral-900/10 h-6 rounded-md"
        style={{ width: `${progress}` }}
      >
        <span className="absolute inset-0 flex items-center justify-between text-gray-800 text-[12px] font-medium mx-4">
          {label}
          <span className="text-[11px] text-slate-500">{progress}%</span>
        </span>
      </div>
    </div>
  );
};

const ImagePollResult = ({ imgUrl, optionVotes, totalVotes }) => {
  return (
    <div className="">
      <div className="w-full bg-black flex items-center gap-2 mb-4 rounded-md overflow-hidden">
        <img
          src={imgUrl}
          alt="Resultado"
          className="w-full h-36 object-contain"
        />
      </div>

      <PollOptionVoteResult optionVotes={optionVotes} totalVotes={totalVotes} />
    </div>
  );
};

const OpenEndedPollResponse = ({
  profileImgUrl,
  userFullName,
  response,
  createdAt,
}) => {
  return (
    <div className="mb-8 ml-3">
      <div className="flex gap-3">
        {profileImgUrl ? (
          <img
            src={profileImgUrl}
            alt={"User img"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <img
            src={"./images/no-avatar.png"}
            alt={"No avatar"}
            className="w-8 h-8 text-[10px] bg-neutral-800/40"
          />
        )}

        <p className="text-[13px] text-black">
          {userFullName}{" "}
          <span className="mx-1 text-[10px] text-neutral-500">°</span>
          <span className="text-[10px] text-neutral-500">{createdAt}</span>
        </p>
      </div>

      <p className="text-xs text-neutral-700 -mt-2 ml-[44px]">{response}</p>
    </div>
  );
};

const PollingResultContent = ({ type, options, voters, responses }) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
    case "rating":
      return (
        <>
          {options.map((option) => (
            <PollOptionVoteResult
              key={option._id}
              label={`${option.optionText} ${type === "rating" ? "⭐" : ""}`}
              optionVotes={option.votes}
              totalVotes={voters || 0}
            />
          ))}
        </>
      );
    case "image-based":
      return (
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <ImagePollResult
              key={option._id}
              imgUrl={option.optionText || ""}
              optionVotes={option.votes}
              totalVotes={voters || 0}
            />
          ))}
        </div>
      );
    case "open-ended":
      return responses.map((response) => {
        return (
          <OpenEndedPollResponse
            key={response._id}
            profileImgUrl={response.voterId?.profileImageUrl}
            userFullName={response.voterId?.fullName || "Anon"}
            response={response.responseText || ""}
            createdAt={
              response.createdAt ? convertDate(response.createdAt, false) : ""
            }
          />
        );
      });
    default:
      return null;
  }
};

export default PollingResultContent;
