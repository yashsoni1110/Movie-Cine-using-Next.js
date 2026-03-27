export default function Search({ placeholder = "Search movie", value, onChange }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-4 xs:pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:bg-white/10 transition-all placeholder:text-gray-500"
    />
  )
}
