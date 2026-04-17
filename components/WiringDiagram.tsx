import { WiringConnection } from "@/types/project";

interface WiringDiagramProps {
  wiring: WiringConnection[];
}

export function WiringDiagram({ wiring }: WiringDiagramProps): React.ReactElement {
  return (
    <div className="rounded-2xl border border-[#2b3340] bg-[#0d1117] p-4">
      <h3 className="mb-4 text-lg font-semibold">Wiring Map</h3>
      <svg viewBox="0 0 720 320" className="h-auto w-full rounded-xl border border-[#2b3340] bg-[#0a0f15] p-2">
        <rect x="28" y="24" width="220" height="268" rx="18" fill="#151f2f" stroke="#2b3340" />
        <text x="48" y="55" fill="#9fd3ff" fontSize="18" fontWeight="700">
          Raspberry Pi GPIO
        </text>

        <rect x="468" y="24" width="220" height="268" rx="18" fill="#142318" stroke="#2b3340" />
        <text x="488" y="55" fill="#96f5bf" fontSize="18" fontWeight="700">
          Modules
        </text>

        {wiring.slice(0, 6).map((connection, index) => {
          const y = 90 + index * 34;
          return (
            <g key={`${connection.from}-${connection.to}-${index}`}>
              <text x="48" y={y} fill="#dbe7ff" fontSize="13">
                {connection.from}
              </text>
              <line x1="230" y1={y - 5} x2="470" y2={y - 5} stroke="#4db2ff" strokeWidth="2" strokeDasharray="5 4" />
              <text x="488" y={y} fill="#d7ffe7" fontSize="13">
                {connection.to}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 space-y-2 text-sm text-[#9aa4b2]">
        {wiring.map((item, idx) => (
          <p key={`${item.from}-${item.to}-${idx}`}>
            <span className="font-medium text-[#f5f8ff]">
              {item.from} → {item.to}:
            </span>{" "}
            {item.note}
          </p>
        ))}
      </div>
    </div>
  );
}
