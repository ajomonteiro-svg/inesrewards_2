import { Gift } from "lucide-react";
import { FaseEmBreve } from "@/components/ui/FaseEmBreve";

export const metadata = { title: "As minhas recompensas" };

export default function RecompensasPage() {
  return (
    <FaseEmBreve
      titulo="As minhas recompensas"
      icone={Gift}
      fase={3}
      texto="Aqui vais poder pedir as recompensas quando tiveres pontos suficientes."
      itens={["Ver todas as recompensas e quanto custam", "Pedir uma recompensa aos pais", "Acompanhar o estado do pedido"]}
    />
  );
}
