import { convertDate } from "../../utils/helper";

const UserProfileInfo = ({ imgUrl, fullName, username, createdAt }) => {
  return (
    <div className="flex items-center gap-4">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={username}
          className="w-10 h-10 rounded-full border-none"
        />
      ) : (
        <img
          src={"./images/no-avatar.png"}
          alt={"No avatar"}
          className="w-20 h-20 bg-neutral-500 rounded-full"
        />
      )}

      <div className="">
        <p className="text-sm text-black font-medium leading-4">
          {fullName}
          <span className="mx-1 text-sm text-slate-500">·</span>
          <span className="text-[10px] text-slate-500">
            {createdAt && convertDate(createdAt, true)}
          </span>
        </p>
        <span className="text-[11.5px] text-slate-500 leading-4">
          @{username}
        </span>
      </div>
    </div>
  );
};

export default UserProfileInfo;
