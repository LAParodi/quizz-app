const Stats = ({ stats }) => {
  return (
    <div className="bg-slate-100/50 rounded-lg mt-6 overflow-hidden sticky top-[80px] p-5">
      <h6 className="text-sm text-black font-medium">Estádisticas</h6>
      <div className="mt-4">
        {stats.length > 0 ? (
          stats.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg cursor-pointer mb-1 px-3 py-2 hover:bg-neutral-500/25"
            >
              <p className="text-xs text-neutral-900">{item.label}</p>
              <span className="text-xs text-neutral-600 rounded py-[2px] px-4">
                {item.count}
              </span>
            </div>
          ))
        ) : (
          <span className="text-xs text-neutral-900">No hay estadísticas</span>
        )}
      </div>
    </div>
  );
};

export default Stats;
