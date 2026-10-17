import type { Role } from "../auth/permissions";

export type KycCaseRecord = {
  id: string;
  name: string;
  kind: "Individual KYC" | "Business KYB";
  market: string;
  status: string;
  risk: "Low" | "Medium" | "High";
  assignedTo: string;
  updatedAt: string;
  signals: string[];
};

export type ApiResult<T> = { data: T; source: "backend" | "mock" };

const demoCases: KycCaseRecord[] = [
  { id: "KY-2841", name: "Ananya Shah", kind: "Individual KYC", market: "India", status: "manual_review", risk: "Low", assignedTo: "Maya Rao", updatedAt: "8 min ago", signals: ["Document authenticity", "Liveness", "Address verified"] },
  { id: "KY-2838", name: "Northstar Trading", kind: "Business KYB", market: "United States", status: "manual_review", risk: "High", assignedTo: "Unassigned", updatedAt: "22 min ago", signals: ["Business registry", "Beneficial owner", "Adverse media"] },
  { id: "KY-2836", name: "Kavya Nair", kind: "Individual KYC", market: "India", status: "documents_submitted", risk: "Medium", assignedTo: "Maya Rao", updatedAt: "41 min ago", signals: ["Document authenticity", "Liveness", "Watchlist"] },
];

export async function listCasesForDemo(_role?: Role): Promise<ApiResult<KycCaseRecord[]>> {
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (endpoint) {
    const response = await fetch(endpoint + "/api/v1/cases", { credentials: "include", cache: "no-store" });
    if (!response.ok) throw new Error("Could not load cases.");
    return { data: await response.json() as KycCaseRecord[], source: "backend" };
  }
  return { data: demoCases, source: "mock" };
}

export async function createDemoCase(input: Pick<KycCaseRecord, "name" | "kind" | "market">): Promise<ApiResult<KycCaseRecord>> {
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (endpoint) {
    const response = await fetch(endpoint + "/api/v1/cases", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Could not create case.");
    return { data: await response.json() as KycCaseRecord, source: "backend" };
  }
  return {
    source: "mock",
    data: { id: "KY-DEMO", ...input, status: "initiated", risk: "Low", assignedTo: "Unassigned", updatedAt: "just now", signals: [] },
  };
}
