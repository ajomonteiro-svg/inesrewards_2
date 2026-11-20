import { Wallet } from "lucide-react";
import { FaseEmBreve } from "@/components/ui/FaseEmBreve";

export const metadata = { title: "Ajustar pontos" };

export default function Page() {
  return (
    <FaseEmBreve
      titulo="Ajustar pontos"
      icone={Wallet}
      fase={3}
      texto="Ajustes de saldo, sempre com registo no histórico."
      itens={["Motivo obrigatório em cada ajuste", "Nunca deixa o saldo negativo", ]}
    />
  );
}
