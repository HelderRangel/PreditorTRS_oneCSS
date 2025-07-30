import type { IconType } from "react-icons";

interface CardProps {
  Value: string | number;
  Text: string;
  Icon?: IconType;
  Unidade?: string;
}

export function CardComponent({ Value, Text, Icon, Unidade }: CardProps) {
  const IconRender = Icon ?? (() => null); // fallback caso não venha icone

  return (
    <div
      className="
        w-full 
        h-[12.4%] 
        p-4 
        rounded-3xl 
        cursor-pointer 
        flex items-center gap-2
        shadow 
        hover:shadow-lg 
        bg-white
        transition-all
        md:justify-center 
        md:h-auto 
        max-h-[25vh]
        mb-1
      "
    >
      <div className="fire-icon-wrapper ml-8 hidden md:block">
        <IconRender size={72} className="text-primary fill-transparent" />
      </div>

      <div
        className="
          flex flex-col items-center justify-center gap-2
          h-[10rem] w-[20rem]
          pr-2 mr-2
          text-text-dark
          md:w-full 
          md:text-[2.5rem]
        "
      >
        <span className="text-center font-sans text-[1.5rem] md:text-[2.5rem] text-text-dark">
          {Text}
        </span>

        <span
          className="
            text-[1.4rem] md:text-[2.5rem]
            font-bold 
            flex gap-2
          "
        >
          {Value}
          <span
            className="
              font-bold 
              text-[1.2rem] md:text-[2rem] 
              text-gray
            "
          >
            {Unidade}
          </span>
        </span>
      </div>
    </div>
  );
}
