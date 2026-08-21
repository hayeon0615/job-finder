import fs from "node:fs/promises";

const API_URL = "https://apis.data.go.kr/1051000/recruitment/list";
const MAX_JOBS = 300;
const PAGE_SIZE = 100;
const accents = ["#e5eaff", "#e7f5ec", "#fff0d6", "#f2e8ff", "#ffe7e1", "#e3f3f2"];

async function readApiKey() {
  const env = await fs.readFile(".env", "utf8");
  const line = env.split(/\r?\n/).find((item) => /^\s*RECRUITMENT_API_KEY\s*=/.test(item));
  if (!line) throw new Error(".env에 RECRUITMENT_API_KEY가 없습니다.");
  const value = line.split("=", 2)[1].trim().replace(/^['\"]|['\"]$/g, "");
  if (!value) throw new Error(".env의 RECRUITMENT_API_KEY가 비어 있습니다.");
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function asText(value) {
  return value == null ? "" : String(value).trim();
}

function splitList(value) {
  return asText(value).split(/\s*,\s*/).map((item) => item.trim()).filter(Boolean);
}

function isYouthIntern(item) {
  return item.recrutSe === "R2030" || asText(item.recrutSeNm).includes("청년인턴") || asText(item.recrutPbancTtl).includes("청년인턴");
}

function isNewcomer(item) {
  return splitList(item.hireTypeLst).includes("R1010") || asText(item.hireTypeNmLst).includes("신입");
}

function regionBucket(location) {
  if (/대전|세종|충남|충북|충청/.test(location)) return "충청권";
  if (/서울|경기|인천|수도권/.test(location)) return "수도권";
  return "";
}

function daysUntil(dateText) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) return 9999;
  const end = new Date(`${dateText}T23:59:59+09:00`);
  const today = new Date();
  const days = Math.ceil((end.getTime() - today.getTime()) / 86400000);
  return Number.isFinite(days) && days >= 0 ? days : 9999;
}

async function fetchPage(serviceKey, extra, pageNo) {
  const params = new URLSearchParams({
    serviceKey,
    resultType: "json",
    ongoingYn: "Y",
    numOfRows: String(PAGE_SIZE),
    pageNo: String(pageNo),
    ...extra,
  });
  const response = await fetch(`${API_URL}?${params}`);
  const body = await response.json();
  if (!response.ok || !["00", "200"].includes(String(body.resultCode))) {
    throw new Error(`API 오류 ${response.status} (${body.resultCode ?? "코드 없음"}): ${body.resultMsg ?? "응답을 해석할 수 없습니다."}`);
  }
  return Array.isArray(body.result) ? body.result : [];
}

async function main() {
  const serviceKey = await readApiKey();
  const rawItems = [];
  for (const extra of [{ hireTypeLst: "R1010" }, { recrutSe: "R2030" }]) {
    for (let pageNo = 1; pageNo <= 3 && rawItems.length < MAX_JOBS * 2; pageNo += 1) {
      const page = await fetchPage(serviceKey, extra, pageNo);
      rawItems.push(...page);
      if (page.length < PAGE_SIZE) break;
    }
  }

  const unique = new Map();
  for (const item of rawItems) {
    if (!isNewcomer(item) && !isYouthIntern(item)) continue;
    const key = asText(item.recrutPblntSn) || `${item.instNm}-${item.recrutPbancTtl}-${item.pbancBgngYmd}`;
    if (!unique.has(key)) unique.set(key, item);
  }

  const jobs = [...unique.values()].slice(0, MAX_JOBS).map((item, index) => {
    const location = asText(item.workRgnNmLst);
    const youthIntern = isYouthIntern(item);
    const deadlineDays = daysUntil(asText(item.pbancEndYmd));
    return {
      id: Number(item.recrutPblntSn) || index + 1,
      company: asText(item.instNm),
      role: asText(item.recrutPbancTtl),
      type: youthIntern ? "인턴" : "신입",
      region: regionBucket(location),
      location,
      workMode: "",
      size: "",
      deadlineDays,
      deadline: deadlineDays === 9999 ? "" : `D-${deadlineDays}`,
      salary: null,
      tags: splitList(item.ncsCdNmLst).slice(0, 3),
      requirements: asText(item.aplyQlfcCn) ? [asText(item.aplyQlfcCn)] : [],
      preferred: asText(item.prefCondCn) ? [asText(item.prefCondCn)] : [],
      accent: accents[index % accents.length],
      logo: "",
      description: asText(item.scrnprcdrMthdExpln),
    };
  });

  await fs.writeFile("jobs.json", `${JSON.stringify(jobs, null, 2)}\n`, "utf8");
  console.log(`saved=${jobs.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
