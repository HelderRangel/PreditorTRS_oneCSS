import { useNavigate } from "react-router-dom";

interface ToggleProps {
  active: "fc42" | "fc43";
}

export function ToggleSwitch({ active }: ToggleProps) {
  const navigate = useNavigate();

  const handleToggle = () => {
    navigate(active === "fc42" ? "/fc43" : "/fc42");
  };

  return (
    <div
      id="toggle"
      onClick={handleToggle}
      className="relative flex items-center justify-between w-full max-w-[18rem] sm:max-w-[25rem] h-10 sm:h-[5rem] text-sm sm:text-[1.2rem] font-light text-gray bg-background-secondary rounded-full cursor-pointer select-none"
    >
      <span
        className={`flex-1 text-center z-1 ${
          active === "fc42" ? "text-white" : ""
        }`}
      >
        Forno 42
      </span>
      <span
        className={`flex-1 text-center z-1 ${
          active === "fc43" ? "text-white" : ""
        }`}
      >
        Forno 43
      </span>

      <div
        className={`absolute top-[0.2rem] bottom-[0.2rem] left-[0.2rem] w-1/2 bg-primary rounded-full transition-transform duration-300 ${
          active === "fc43" ? "translate-x-full" : ""
        }`}
      />
    </div>
  );
}
