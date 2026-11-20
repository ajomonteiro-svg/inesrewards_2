import { Settings } from "lucide-react";
import { FaseEmBreve } from "@/components/ui/FaseEmBreve";

export const metadata = { title: "Definições" };

export default function Page() {
  return (
    <FaseEmBreve
      titulo="Definições"
      icone={Settings}
      fase={5}
      texto="Objetivos semanais e personalização."
      itens={["Objetivo semanal de pontos", "Nome, avatar, cores e mensagens", ]}
    />
  );
}
