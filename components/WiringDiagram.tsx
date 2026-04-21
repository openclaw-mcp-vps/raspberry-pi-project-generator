import type { ProjectWiringDiagram } from "@/lib/types";

interface WiringDiagramProps {
  diagram: ProjectWiringDiagram;
}

export default function WiringDiagram({ diagram }: WiringDiagramProps) {
  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-[#30363d] bg-[#0d1117]/70 p-3 text-sm text-slate-300">
        {diagram.notes}
      </p>
      <div className="overflow-x-auto rounded-lg border border-[#30363d]">
        <table className="min-w-full divide-y divide-[#30363d] text-left text-sm">
          <thead className="bg-[#0d1117] text-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Wire color</th>
              <th className="px-4 py-3 font-medium">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#30363d] bg-[#161b22]/75 text-slate-300">
            {diagram.connections.map((connection) => (
              <tr key={`${connection.from}-${connection.to}-${connection.color}`}>
                <td className="px-4 py-3">{connection.from}</td>
                <td className="px-4 py-3">{connection.to}</td>
                <td className="px-4 py-3">{connection.color}</td>
                <td className="px-4 py-3">{connection.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
