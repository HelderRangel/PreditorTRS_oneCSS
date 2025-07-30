interface RecommendedValue {
  VazaoMetanolQueimador?: number;
  AnalisadorOxigenio?: number;
  CO?: number;
  VazaoGasNatural?: number;
  TemperaturaCiclone?: number;
  DensidadeLama?: number;
  probabilidade_pico_TRS?: number;
}

interface RecommendedValuesTableProps {
  data: RecommendedValue[];
  onHelpClick: () => void;
}

export function RecommendedValuesTable({
  data,
  onHelpClick,
}: RecommendedValuesTableProps) {
  return (
    <div className="flex-1 bg-white p-4 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[2rem]">Valores recomendados de processo</span>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
          alt="ChatGPT"
          className="w-8 h-8 cursor-pointer rounded-xl hover:rotate-360 transition-transform"
          onClick={onHelpClick}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th>Queima do Metanol</th>
              <th>Analisador de oxigênio</th>
              <th>CO</th>
              <th>Vazão gás natural</th>
              <th>Temp. do ciclone</th>
              <th>Densidade da Lama</th>
              <th>Prob. Pico %</th>
            </tr>
          </thead>
          <tbody>
            {[...data]
              .sort(
                (a, b) =>
                  (a.probabilidade_pico_TRS ?? 0) -
                  (b.probabilidade_pico_TRS ?? 0)
              )
              .map((item, index) => (
                <tr key={index} className="border-b">
                  <td>{item.VazaoMetanolQueimador?.toFixed(2)}</td>
                  <td>{item.AnalisadorOxigenio?.toFixed(2)}</td>
                  <td>{item.CO?.toFixed(2)}</td>
                  <td>{item.VazaoGasNatural?.toFixed(2)}</td>
                  <td>{item.TemperaturaCiclone?.toFixed(2)}</td>
                  <td>{item.DensidadeLama?.toFixed(3)}</td>
                  <td>{item.probabilidade_pico_TRS?.toFixed(2)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
