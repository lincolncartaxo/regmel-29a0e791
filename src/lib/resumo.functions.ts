import { createServerFn } from "@tanstack/react-start";

const SPREADSHEET_ID = "1NfJzOiJbl5pXdeu_uqnXzzUs73xJvPexzpmLcGpIWYs";
const RANGE = "RESUMO GERAL!A1:Z40";

export type Comunidade = {
  apf: string;
  municipio: string;
  comunidade: string;
  total: number;
  subtotal: number;
  inapto: number;
  apto: number;
  inaptoNisNaoLocalizado: number;
  temContrato: number;
  inaptoNaoRf: number;
  aptoDuplicado: number;
  semContratoSemConsulta: number;
  aptoSemContrato: number;
  inaptoSemContrato: number;
  desvio: number;
  status: "em_andamento" | "pendente";
};

export type ResumoPayload = {
  comunidades: Comunidade[];
  totals: Omit<Comunidade, "apf" | "municipio" | "comunidade" | "status">;
  updatedAt: string;
};

const num = (v: unknown) => (typeof v === "number" ? v : v === "" || v == null ? 0 : Number(v) || 0);
const cleanName = (s: string) =>
  s.replace(/\s+/g, " ").replace(/\s*-\s*João Pessoa.*$/i, "").replace(/^Comunidade\s+/i, "").trim();

export const getResumo = createServerFn({ method: "GET" }).handler(async (): Promise<ResumoPayload> => {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovableKey) throw new Error("LOVABLE_API_KEY ausente no servidor");
  if (!sheetsKey) throw new Error("GOOGLE_SHEETS_API_KEY ausente — conecte o Google Sheets");

  const url = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(RANGE)}?valueRenderOption=UNFORMATTED_VALUE`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": sheetsKey,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Sheets API ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as { values?: unknown[][] };
  const rows = json.values ?? [];

  const comunidades: Comunidade[] = [];
  let totals: ResumoPayload["totals"] | null = null;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;
    const apf = String(r[0] ?? "").trim();
    if (!apf) continue;

    const base = {
      total: num(r[3]),
      subtotal: num(r[4]),
      inapto: num(r[5]),
      apto: num(r[6]),
      inaptoNisNaoLocalizado: num(r[7]),
      temContrato: num(r[8]),
      inaptoNaoRf: num(r[9]),
      aptoDuplicado: num(r[10]),
      semContratoSemConsulta: num(r[11]),
      aptoSemContrato: num(r[12]),
      inaptoSemContrato: num(r[13]),
      desvio: num(r[14]),
    };

    if (apf.toUpperCase() === "TOTAL") {
      totals = base;
      continue;
    }

    const apto = r[6];
    const isPendente = apto === "" || apto == null;

    comunidades.push({
      apf,
      municipio: String(r[1] ?? "").trim(),
      comunidade: cleanName(String(r[2] ?? "")),
      ...base,
      status: isPendente ? "pendente" : "em_andamento",
    });
  }

  if (!totals) {
    totals = comunidades.reduce(
      (acc, c) => ({
        total: acc.total + c.total,
        subtotal: acc.subtotal + c.subtotal,
        inapto: acc.inapto + c.inapto,
        apto: acc.apto + c.apto,
        inaptoNisNaoLocalizado: acc.inaptoNisNaoLocalizado + c.inaptoNisNaoLocalizado,
        temContrato: acc.temContrato + c.temContrato,
        inaptoNaoRf: acc.inaptoNaoRf + c.inaptoNaoRf,
        aptoDuplicado: acc.aptoDuplicado + c.aptoDuplicado,
        semContratoSemConsulta: acc.semContratoSemConsulta + c.semContratoSemConsulta,
        aptoSemContrato: acc.aptoSemContrato + c.aptoSemContrato,
        inaptoSemContrato: acc.inaptoSemContrato + c.inaptoSemContrato,
        desvio: acc.desvio + c.desvio,
      }),
      {
        total: 0, subtotal: 0, inapto: 0, apto: 0, inaptoNisNaoLocalizado: 0,
        temContrato: 0, inaptoNaoRf: 0, aptoDuplicado: 0, semContratoSemConsulta: 0,
        aptoSemContrato: 0, inaptoSemContrato: 0, desvio: 0,
      },
    );
  }

  return { comunidades, totals, updatedAt: new Date().toISOString() };
});
