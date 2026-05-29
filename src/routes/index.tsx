import { createFileRoute } from "@tanstack/react-router";
import { comunidades, totals } from "@/data/resumo";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { ArrowUpRight, Users, CheckCircle2, XCircle, FileText, TrendingDown, Building2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resumo Geral — Comunidades João Pessoa" },
      { name: "description", content: "Dashboard de acompanhamento das APFs nas comunidades de João Pessoa-PB." },
    ],
  }),
  component: Dashboard,
});

const fmt = (n: number) => n.toLocaleString("pt-BR");
const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

function Dashboard() {
  const ativas = comunidades.filter((c) => c.status === "em_andamento");
  const pendentes = comunidades.filter((c) => c.status === "pendente").length;
  const metaTotal = totals.subtotal;
  const aptosTotal = totals.apto + totals.aptoSemContrato + totals.aptoDuplicado;
  const inaptosTotal = totals.inapto + totals.inaptoNisNaoLocalizado + totals.inaptoNaoRf + totals.inaptoSemContrato;
  const cobertura = pct(metaTotal + totals.desvio, metaTotal);

  const barData = comunidades.map((c) => ({
    name: c.comunidade.replace("Comunidade ", "").split(" - ")[0].slice(0, 18),
    Meta: c.subtotal,
    Atingido: c.subtotal + c.desvio,
  }));

  const distData = [
    { name: "Aptos", value: aptosTotal, color: "var(--chart-1)" },
    { name: "Inaptos", value: inaptosTotal, color: "var(--chart-4)" },
    { name: "Tem contrato", value: totals.temContrato, color: "var(--chart-2)" },
    { name: "Sem consulta", value: totals.semContratoSemConsulta, color: "var(--chart-3)" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Resumo Geral — Comunidades</h1>
              <p className="text-xs text-muted-foreground">João Pessoa / PB · {comunidades.length} APFs monitoradas</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
            Dados consolidados
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total de famílias"
            value={fmt(totals.total)}
            icon={<Users className="h-4 w-4" />}
            hint={`${comunidades.length} comunidades`}
          />
          <KpiCard
            label="Meta (50% + 1)"
            value={fmt(totals.subtotal)}
            icon={<FileText className="h-4 w-4" />}
            hint={`${cobertura}% de cobertura atual`}
          />
          <KpiCard
            label="Aptos"
            value={fmt(aptosTotal)}
            icon={<CheckCircle2 className="h-4 w-4" />}
            hint={`${pct(aptosTotal, totals.total)}% do total`}
            tone="success"
          />
          <KpiCard
            label="Desvio para meta"
            value={fmt(totals.desvio)}
            icon={<TrendingDown className="h-4 w-4" />}
            hint={`${pendentes} comunidades pendentes`}
            tone="danger"
          />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold">Meta vs. Atingido por comunidade</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Comparativo entre meta (50% + 1) e progresso atual</p>
              </div>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 30 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} angle={-25} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    cursor={{ fill: "var(--muted)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Meta" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Atingido" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <h2 className="text-base font-semibold">Distribuição geral</h2>
            <p className="text-xs text-muted-foreground mt-0.5 mb-4">Situação consolidada das famílias</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {distData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {distData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-medium">{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community cards */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Comunidades</h2>
              <p className="text-xs text-muted-foreground">Progresso individual por APF</p>
            </div>
            <span className="text-xs text-muted-foreground">{ativas.length} em andamento · {pendentes} pendentes</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comunidades.map((c) => {
              const atingido = c.subtotal + c.desvio;
              const progresso = Math.max(0, Math.min(100, Math.round((atingido / c.subtotal) * 100)));
              const ok = c.desvio >= 0;
              return (
                <div key={c.apf} className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition-all" style={{ boxShadow: "var(--shadow-elegant)" }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{c.apf}</p>
                      <h3 className="font-semibold text-sm mt-1 truncate">{c.comunidade.replace("Comunidade ", "")}</h3>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${c.status === "pendente" ? "bg-[color-mix(in_oklab,var(--warning)_20%,transparent)] text-[var(--warning)]" : "bg-accent text-accent-foreground"}`}>
                      {c.status === "pendente" ? "Pendente" : "Ativa"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight">{fmt(atingido)}</span>
                    <span className="text-xs text-muted-foreground">/ {fmt(c.subtotal)} meta</span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progresso}%`,
                        background: ok ? "var(--gradient-primary)" : "var(--chart-4)",
                      }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{progresso}% da meta</span>
                    <span className={`flex items-center gap-1 font-medium ${ok ? "text-[var(--success)]" : "text-destructive"}`}>
                      <ArrowUpRight className={`h-3 w-3 ${ok ? "" : "rotate-90"}`} />
                      {c.desvio > 0 ? `+${c.desvio}` : c.desvio}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
                    <Mini label="Aptos" value={c.apto + c.aptoSemContrato + c.aptoDuplicado} icon="ok" />
                    <Mini label="Inaptos" value={c.inapto + c.inaptoNisNaoLocalizado + c.inaptoNaoRf + c.inaptoSemContrato} icon="bad" />
                    <Mini label="Contratos" value={c.temContrato} icon="doc" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Table */}
        <section className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold">Detalhamento completo</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Todos os indicadores extraídos do Resumo Geral</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">APF</th>
                  <th className="text-left px-4 py-3 font-medium">Comunidade</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-right px-4 py-3 font-medium">Meta</th>
                  <th className="text-right px-4 py-3 font-medium">Apto</th>
                  <th className="text-right px-4 py-3 font-medium">Inapto</th>
                  <th className="text-right px-4 py-3 font-medium">Contratos</th>
                  <th className="text-right px-4 py-3 font-medium">Desvio</th>
                </tr>
              </thead>
              <tbody>
                {comunidades.map((c) => (
                  <tr key={c.apf} className="border-t border-border hover:bg-muted/40">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.apf}</td>
                    <td className="px-4 py-3 font-medium">{c.comunidade.replace("Comunidade ", "")}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmt(c.total)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmt(c.subtotal)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-[var(--success)]">{fmt(c.apto)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmt(c.inapto + c.inaptoNisNaoLocalizado + c.inaptoNaoRf + c.inaptoSemContrato)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmt(c.temContrato)}</td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${c.desvio >= 0 ? "text-[var(--success)]" : "text-destructive"}`}>
                      {c.desvio > 0 ? `+${c.desvio}` : c.desvio}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-border bg-muted/30 font-semibold">
                  <td className="px-4 py-3" colSpan={2}>TOTAL</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmt(totals.total)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmt(totals.subtotal)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-[var(--success)]">{fmt(totals.apto)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmt(totals.inapto + totals.inaptoNisNaoLocalizado + totals.inaptoNaoRf + totals.inaptoSemContrato)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{fmt(totals.temContrato)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-destructive">{fmt(totals.desvio)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer className="text-center text-xs text-muted-foreground py-6">
          Fonte: Resumo Geral · Programa habitacional João Pessoa/PB
        </footer>
      </main>
    </div>
  );
}

function KpiCard({ label, value, icon, hint, tone }: { label: string; value: string; icon: React.ReactNode; hint?: string; tone?: "success" | "danger" }) {
  const toneColor = tone === "success" ? "text-[var(--success)]" : tone === "danger" ? "text-destructive" : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="h-8 w-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">{icon}</span>
      </div>
      <p className={`mt-3 text-3xl font-bold tracking-tight tabular-nums ${toneColor}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Mini({ label, value, icon }: { label: string; value: number; icon: "ok" | "bad" | "doc" }) {
  const Icon = icon === "ok" ? CheckCircle2 : icon === "bad" ? XCircle : FileText;
  const color = icon === "ok" ? "text-[var(--success)]" : icon === "bad" ? "text-destructive" : "text-muted-foreground";
  return (
    <div>
      <div className={`flex items-center justify-center gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-sm font-semibold tabular-nums">{fmt(value)}</span>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
