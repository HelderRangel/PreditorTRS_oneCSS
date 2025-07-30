import { ArrowUp, ArrowDown } from "lucide-react";

interface VariableImpact {
  variavel: string;
  impacto_percentual?: number;
  efeito: string;
}

interface VariableImpactTableProps {
  data: VariableImpact[];
}

export function VariableImpactTable({ data }: VariableImpactTableProps) {
  return (
    <div className="flex-1 bg-white p-4 rounded-2xl shadow">
      <span className="text-[2rem] mb-2 block">Impacto de cada variável</span>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td>{item.variavel}</td>
                <td className="bg-background-secondary px-4 py-1 rounded-xl text-center">
                  {item.impacto_percentual?.toFixed(2)}
                </td>
                <td className="text-right">
                  {item.efeito === "aumentando" ? (
                    <ArrowUp size={25} strokeWidth={2} className="text-up" />
                  ) : (
                    <ArrowDown
                      size={25}
                      strokeWidth={2}
                      className="text-down"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
