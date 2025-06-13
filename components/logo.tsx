export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        <div className="w-1.5 h-6 bg-indigo-500 rounded-sm"></div>
        <div className="w-1.5 h-6 bg-indigo-500 rounded-sm opacity-70"></div>
        <div className="w-1.5 h-6 bg-indigo-500 rounded-sm opacity-40"></div>
      </div>
      <span className="font-bold text-xl text-gray-50">kanban</span>
    </div>
  )
}
