import { ConfiguratorShell } from "@/components/ConfiguratorShell";
import { samplePanels } from "@/lib/sampleData";
import { sampleProcessors } from "@/lib/sampleProcessors";

export default function ConfiguratorPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <ConfiguratorShell panels={samplePanels} processors={sampleProcessors} />
    </main>
  );
}
