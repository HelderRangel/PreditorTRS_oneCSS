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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl p-8 shadow-lg">
        <button
          className="absolute top-2 right-2 text-xl text-gray cursor-pointer"
          onClick={fechar}
        >
          <IoMdClose />
        </button>

        <p
          className="flex-1 overflow-y-auto bg-modal-bg rounded-2xl p-4 text-[1.4rem]"
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
