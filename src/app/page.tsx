import { Wrench } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
          <Wrench className="h-6 w-6 text-[#F26A3D]" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#202522]">
            FixMate
          </h1>
          <p className="text-sm text-muted-foreground">
            Smart Device & Home Appliance Repair Platform
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Workspace scaffolding verified. Application core initialized.
        </p>
      </div>
    </main>
  );
}
