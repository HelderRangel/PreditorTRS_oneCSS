import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { apiFC43, apiGPT } from "../../service/api";
import { CardComponent } from "../../components/cards";
import { ToggleSwitch } from "../../components/toggleswitch";
import { ModalGPT } from "../../components/modalgpt/ModalGPT";
import {
  Factory,
  Flame,
  Wind,
  CloudAlert,
  WindArrowDown,
  Tornado,
  Droplet,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export function FurnacePage({
  endpoint,
  toggleActive,
}: {
  endpoint: string;
  toggleActive: string;
}) {
  const navigate = useNavigate();
  const [info, setInfo] = useState<any>({});
  const [respostaGPT, setRespostaGPT] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [carregandoGPT, setCarregandoGPT] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFC43.get(endpoint);
        setInfo(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [endpoint]);

  const abrirModalGPT = () => setMostrarModal(true);
  const fecharModalGPT = () => {
    setMostrarModal(false);
    setRespostaGPT("");
  };

  const consultarGPT = async () => {
    if (carregandoGPT) return;
    setCarregandoGPT(true);
    try {
      setRespostaGPT("");
      const DadosAtuais = `
        VALORES ATUAIS DAS VARIAVEIS: ${JSON.stringify(info.entradas)}
        PROBABILIDADE DE PICO (XGBOOST): ${JSON.stringify(
          info.probabilidade_pico_TRS
        )}
        SHAP VARIÁVEIS EXPLICADAS: ${JSON.stringify(info.impactos_variaveis)}
        VALORES BONS PRÓXIMOS (KNN): ${JSON.stringify(
          info.vizinhos_bons_proximos
        )}
      `;
      const resposta = await apiGPT.post("/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em recuperação química.",
          },
          { role: "user", content: DadosAtuais },
        ],
        temperature: 0.7,
      });
      setRespostaGPT(resposta.data.choices[0].message.content);
    } catch (error) {
      console.error("Erro ao consultar GPT:", error);
    } finally {
      setCarregandoGPT(false);
    }
  };

  const GaugeTRS = ({ valor = 0 }: { valor: number }) => {
    const data = [
      {
        name: "TRS",
        value: valor,
        fill: valor > 70 ? "#ff4d4f" : valor > 50 ? "#faad14" : "#52c41a",
      },
    ];
    return (
      <ResponsiveContainer width="100%" height="90%">
        <RadialBarChart
          cx="50%"
          cy="65%"
          innerRadius="100%"
          outerRadius="80%"
          barSize={40}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" background />
          <text
            x="50%"
            y="63%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={22}
            fontWeight="bold"
            fill="#333"
          >
            {valor.toFixed(2)}%
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

  const TrendChart = ({ data }: { data: any[] }) => {
    const formattedData = data.map((item) => ({
      name: new Date(item.Timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fullDate: new Date(item.Timestamp),
      value: item.Value,
      pred: item.PreditorTRS,
      metanol: item.Metanol,
      oxigenio: item.Oxigenio,
      temperatura: item.Temperatura,
      co: item.CO,
      gas: item.GAS,
      lama: item.LAMA,
    }));

    return (
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Legend />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="value"
            stroke="#89CFF0"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="pred"
            stroke="#FFD6A5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="flex flex-col w-full h-screen p-4 font-sans gap-4">
      <header className="w-full h-24 p-4 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-[2rem] text-black">Preditor de TRS</h1>
          <p className="text-gray text-[1.4rem]">
            Visão atual e histórica sobre as condições de TRS
          </p>
        </div>
        <ToggleSwitch active={toggleActive as "fc42" | "fc43"} />
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        <section className="w-full lg:w-1/5 flex flex-col gap-4">
          <CardComponent
            Value={info.entradas?.VazaoMetanolQueimador ?? "..."}
            Text="Queima do metanol"
            Icon={Flame}
            Unidade="kg/h"
          />
          <CardComponent
            Value={info.entradas?.AnalisadorOxigenio ?? "..."}
            Text="Analisador de oxigênio"
            Icon={Wind}
            Unidade="%"
          />
          <CardComponent
            Value={info.entradas?.CO ?? "..."}
            Text="CO"
            Icon={CloudAlert}
            Unidade="ppm"
          />
          <CardComponent
            Value={info.entradas?.VazaoGasNatural ?? "..."}
            Text="Vazão gás natural"
            Icon={WindArrowDown}
            Unidade="nm³/h"
          />
          <CardComponent
            Value={info.entradas?.TemperaturaCiclone ?? "..."}
            Text="Temp. do ciclone"
            Icon={Tornado}
            Unidade="°C"
          />
          <CardComponent
            Value={info.entradas?.DensidadeLama ?? "..."}
            Text="Densidade da lama"
            Icon={Droplet}
            Unidade="kg/cm³"
          />
          <CardComponent
            Value={info.trs_atual ?? "..."}
            Text="TRS"
            Icon={Factory}
            Unidade="mg/nm³"
          />
        </section>

        <section className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col xl:flex-row gap-4 h-[42%]">
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center w-full xl:w-1/3">
              <span className="text-[2.1rem] mb-4">Preditor de TRS</span>
              <GaugeTRS valor={info.probabilidade_pico_TRS} />
            </div>
            <div className="bg-white rounded-2xl shadow p-4 w-full">
              <span className="text-[2.1rem] mb-2 block text-text-dark">
                TRS últimas 24 horas
              </span>
              <TrendChart data={info.trend ?? []} />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 flex-1">
            <div className="flex-1 bg-white p-4 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[2rem]">
                  Valores recomendados de processo
                </span>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
                  alt="ChatGPT"
                  className="w-8 h-8 cursor-pointer rounded-xl hover:rotate-360 transition-transform"
                  onClick={abrirModalGPT}
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
                    {[...(info.vizinhos_bons_proximos ?? [])]
                      .sort(
                        (a, b) =>
                          a.probabilidade_pico_TRS - b.probabilidade_pico_TRS
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

            <div className="flex-1 bg-white p-4 rounded-2xl shadow">
              <span className="text-[2rem] mb-2 block">
                Impacto de cada variável
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    {[...(info.impactos_variaveis ?? [])].map((item, index) => (
                      <tr key={index} className="border-b">
                        <td>{item.variavel}</td>
                        <td className="bg-background-secondary px-4 py-1 rounded-xl text-center">
                          {item.impacto_percentual?.toFixed(2)}
                        </td>
                        <td className="text-right">
                          {item.efeito === "aumentando" ? (
                            <ArrowUp
                              size={25}
                              strokeWidth={2}
                              className="text-up"
                            />
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
          </div>
        </section>
      </main>

      {mostrarModal && (
        <ModalGPT
          resposta={respostaGPT}
          carregando={carregandoGPT}
          fechar={fecharModalGPT}
          consultar={consultarGPT}
        />
      )}
    </div>
  );
}
