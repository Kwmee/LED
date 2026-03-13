import { ConfiguratorShell } from "@/components/ConfiguratorShell";
import { samplePanels } from "@/lib/sampleData";
import { sampleProcessors } from "@/lib/sampleProcessors";

export default function ConfiguratorPage() {
  return (
    <main className="min-h-screen">
      <ConfiguratorShell panels={samplePanels} processors={sampleProcessors} />
    </main>
  );
}
