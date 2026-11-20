import { Gift } from "lucide-react";
import { FaseEmBreve } from "@/components/ui/FaseEmBreve";

export const metadata = { title: "Gerir recompensas" };

export default function Page() {
  return (
    <FaseEmBreve
      titulo="Gerir recompensas"
      icone={Gift}
      fase={3}
      texto="Criar, editar e eliminar recompensas."
      itens={["Imagem ou ícone, nome, descrição e pontos", ]}
    />
  );
}
