import { Medal } from "lucide-react";
import { FaseEmBreve } from "@/components/ui/FaseEmBreve";

export const metadata = { title: "Medalhas e conquistas" };

export default function MedalhasPage() {
  return (
    <FaseEmBreve
      titulo="Medalhas e conquistas"
      icone={Medal}
      fase={4}
      texto="Aqui vais ver todas as medalhas que já ganhaste e as que ainda faltam."
      itens={["Medalhas desbloqueadas automaticamente", "Progresso para a próxima medalha"]}
    />
  );
}
