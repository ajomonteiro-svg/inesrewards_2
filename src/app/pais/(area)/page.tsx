import { LayoutDashboard } from "lucide-react";
import { FaseEmBreve } from "@/components/ui/FaseEmBreve";

export const metadata = { title: "Resumo" };

export default function Page() {
  return (
    <FaseEmBreve
      titulo="Resumo"
      icone={LayoutDashboard}
      fase={5}
      texto="Estatísticas e evolução da Inês."
      itens={["Pontos conquistados e taxa de conclusão", "Evolução semanal e categorias com mais participação", "Recompensas resgatadas", ]}
    />
  );
}
