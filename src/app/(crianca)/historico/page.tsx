import { History } from "lucide-react";
import { FaseEmBreve } from "@/components/ui/FaseEmBreve";

export const metadata = { title: "Histórico" };

export default function HistoricoPage() {
  return (
    <FaseEmBreve
      titulo="Histórico"
      icone={History}
      fase={4}
      texto="Aqui vais rever tudo o que já fizeste, por semana e por mês."
      itens={["Tarefas realizadas e pontos conquistados", "Recompensas resgatadas", "Medalhas desbloqueadas"]}
    />
  );
}
