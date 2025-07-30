import { IoMdClose } from "react-icons/io";

interface ModalGPTProps {
  resposta: string;
  carregando: boolean;
  fechar: () => void;
  consultar: () => void;
}

export function ModalGPT({
  resposta,
  carregando,
  fechar,
  consultar,
}: ModalGPTProps) {
  function formatarTextoMarkdown(texto: string) {
    const comNegrito = texto.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const comQuebraLinha = comNegrito.replace(/\n/g, "<br />");
    return comQuebraLinha;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-9999 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl h-[70rem] rounded-2xl p-8 shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-xl text-gray cursor-pointer"
          onClick={fechar}
        >
          <IoMdClose />
        </button>

        <p
          className="bg-modal-bg rounded-2xl p-4 text-[1.4rem] h-[95%] overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: formatarTextoMarkdown(resposta) }}
        />

        <div className="w-full flex justify-center h-12">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
            alt="ChatGPT"
            className={`w-12 h-12 rounded-lg mt-4 transition-transform ease-in-out duration-500 hover:rotate-360 ${
              carregando ? "animate-spin" : ""
            }`}
            onClick={consultar}
          />
        </div>
      </div>
    </div>
  );
}
