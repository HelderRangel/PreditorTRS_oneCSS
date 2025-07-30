import { useEffect, useState } from "react";
import { GaugeTRS } from "../../components/GaugeTRS";
import { TrendChart } from "../../components/TrendChart";
import { RecommendedValuesTable } from "../../components/RecomendedValueTable";
import { VariableImpactTable } from "../../components/VariableImpactTable";
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
} from "lucide-react";

interface TrendData {
  Timestamp: string;
  Value: number;
  PreditorTRS: number;
  Metanol: number;
  Oxigenio: number;
  Temperatura: number;
  CO: number;
  GAS: number;
  LAMA: number;
}

interface FurnaceInfo {
  entradas?: Record<string, number>;
  probabilidade_pico_TRS?: number;
  trs_atual?: number;
  trend?: TrendData[];
  vizinhos_bons_proximos?: Array<Record<string, number>>;
  impactos_variaveis?: Array<{
    variavel: string;
    impacto_percentual: number;
    efeito: string;
  }>;
}

export function FurnacePage({
  endpoint,
  toggleActive,
}: {
  endpoint: string;
  toggleActive: string;
}) {
  const [info, setInfo] = useState<FurnaceInfo>({});
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

  return (
    <div className="flex flex-col p-4 font-sans gap-4">
      <header className=" h-24 p-4 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-[2rem] text-black">Preditor de TRS</h1>
          <p className="text-gray text-[1.4rem]">
            Visão atual e histórica sobre as condições de TRS
          </p>
        </div>
        <ToggleSwitch active={toggleActive as "fc42" | "fc43"} />
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden min-w-0">
        <section className="w-full lg:w-1/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
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
              <GaugeTRS valor={info.probabilidade_pico_TRS ?? 0} />
            </div>
            <div className="bg-white rounded-2xl shadow p-4 w-full">
              <span className="text-[2.1rem] mb-2 block text-text-dark">
                TRS últimas 24 horas
              </span>
              <TrendChart data={info.trend ?? []} />
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 flex-1">
            <RecommendedValuesTable
              data={info.vizinhos_bons_proximos ?? []}
              onHelpClick={abrirModalGPT}
            />

            <VariableImpactTable data={info.impactos_variaveis ?? []} />
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
