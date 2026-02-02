const RoomsPanel = () => {
  return (
    <div className="overflow-y-auto w-full py-3 px-3">
      {/* Static for now */}
      <div className="p-3 mb-2 rounded-lg bg-base-200 hover:bg-base-300 cursor-pointer">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Coffee Shop ☕</p>
            <p className="text-xs text-zinc-400">5 users • ⏳ 10 min</p>
          </div>
          <button className="btn btn-xs btn-primary">Join</button>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-base-200 hover:bg-base-300 cursor-pointer">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Gym Talk 💪</p>
            <p className="text-xs text-zinc-400">3 users • ⏳ 5 min</p>
          </div>
          <button className="btn btn-xs btn-primary">Join</button>
        </div>
      </div>
    </div>
  );
};

export default RoomsPanel;
