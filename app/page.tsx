"use client";

import { useMemo, useState } from "react";
import jobsData from "../jobs.json";

type Job = {
  id: number;
  company: string;
  role: string;
  type: "인턴" | "신입" | "현장실습" | "계약직" | "";
  region: "충청권" | "수도권" | "";
  location: string;
  workMode: "대면" | "하이브리드" | "재택" | "";
  size: "대기업" | "중견기업" | "스타트업" | "";
  deadlineDays: number;
  deadline: string;
  salary: string | null;
  tags: string[];
  requirements: string[];
  preferred: string[];
  accent: string;
  logo: string;
  description: string;
};

const jobs: Job[] = jobsData as Job[];

type Filters = { region: string; type: string; workMode: string; size: string; salary: boolean };
const initialFilters: Filters = { region: "전체 지역", type: "전체 고용형태", workMode: "전체 근무형태", size: "전체 기업규모", salary: false };

function recommendationScore(job: Job) {
  return (job.region === "충청권" ? 30 : 14) + (job.type === "신입" || job.type === "인턴" ? 20 : 12) + (job.deadlineDays <= 7 ? 18 : 8) + (job.workMode !== "대면" ? 12 : 0) + (job.size === "대기업" || job.size === "중견기업" ? 10 : 4) + (job.salary ? 6 : 0) + (job.tags.includes("전자공학") || job.preferred.some((item) => item.includes("전자공학")) ? 8 : 0);
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("추천순");
  const [saved, setSaved] = useState<number[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredJobs = useMemo(() => {
    const result = jobs.filter((job) => {
      const searchable = `${job.company} ${job.role} ${job.location} ${job.tags.join(" ")}`.toLowerCase();
      return (!query || searchable.includes(query.trim().toLowerCase())) &&
        (filters.region === "전체 지역" || job.region === filters.region) &&
        (filters.type === "전체 고용형태" || job.type === filters.type) &&
        (filters.workMode === "전체 근무형태" || job.workMode === filters.workMode) &&
        (filters.size === "전체 기업규모" || job.size === filters.size) &&
        (!filters.salary || Boolean(job.salary));
    });
    return [...result].sort((a, b) => sort === "마감 임박순" ? a.deadlineDays - b.deadlineDays : recommendationScore(b) - recommendationScore(a));
  }, [filters, query, sort]);

  const displayedJobs = showSaved ? filteredJobs.filter((job) => saved.includes(job.id)) : filteredJobs;
  const savedJobs = jobs.filter((job) => saved.includes(job.id));

  function announce(message: string) { setNotice(message); window.setTimeout(() => setNotice(""), 2200); }
  function toggleSaved(id: number) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    announce(saved.includes(id) ? "저장 목록에서 삭제했어요." : "저장했어요. 저장 목록에서 비교할 수 있어요.");
  }
  function updateNote(id: number, value: string) { setNotes((current) => ({ ...current, [id]: value })); }
  function resetFilters() { setFilters(initialFilters); setQuery(""); setShowSaved(false); }

  return <main>
    <nav className="topbar"><div className="nav-inner"><a className="brand" href="#top"><span className="brand-mark">+</span> 커리어픽</a><div className="nav-links"><button className={!showSaved ? "active" : ""} onClick={() => setShowSaved(false)}>공고 탐색</button><button className={showSaved ? "active" : ""} onClick={() => setShowSaved(true)}>저장한 공고 <span className="nav-count">{saved.length}</span></button><a href="#guide">취업 가이드</a></div><button className="profile-button" aria-label="내 프로필 열기"><span className="avatar">김</span><span>내 프로필</span><span className="chevron">⌄</span></button></div></nav>
    <section className="hero" id="top"><div className="hero-inner"><div className="hero-copy"><p className="eyebrow"><span className="spark">✦</span> 대전·충청권 우선 추천</p><h1>첫 커리어를 찾는<br /><em>가장 현실적인 방법.</em></h1><p className="hero-description">신입 지원 가능 여부, 근무 지역, 마감일과<br className="desktop-only" /> 전자공학 관련 역량을 한 번에 비교해보세요.</p></div><div className="hero-art" aria-hidden="true"><div className="sun"></div><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="plant"><i></i><i></i><b></b></div><div className="paper paper-one">FIRST<br /><strong>MOVE</strong></div><div className="paper paper-two">✦</div><div className="sticker">FIND<br />YOUR<br /><strong>WAY</strong></div></div></div></section>
    <section className="content" id="jobs"><div className="section-heading"><div><p className="section-kicker">RECOMMENDED FOR YOU</p><h2>{showSaved ? "저장한 공고" : "오늘의 추천 공고"}</h2><p className="muted">{showSaved ? "나중에 비교해볼 공고를 모아두었어요." : "충청권·신입 가능·마감 임박 공고부터 보여드려요."}</p></div><div className="result-summary"><strong>{displayedJobs.length}</strong>개 공고</div></div>
      <div className="search-and-sort"><div className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="직무, 기업명, 키워드로 찾아보세요" aria-label="공고 검색" />{query && <button onClick={() => setQuery("")} aria-label="검색어 지우기">×</button>}</div><label className="sort-select">정렬 <select value={sort} onChange={(e) => setSort(e.target.value)}><option>추천순</option><option>마감 임박순</option></select></label></div>
      <div className="filter-panel"><div className="filter-label"><span>필터</span><button onClick={resetFilters}>초기화</button></div><div className="filter-row"><select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })} aria-label="지역 필터"><option>전체 지역</option><option>충청권</option><option>수도권</option></select><select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} aria-label="고용 형태 필터"><option>전체 고용형태</option><option>인턴</option><option>신입</option><option>현장실습</option><option>계약직</option></select><select value={filters.workMode} onChange={(e) => setFilters({ ...filters, workMode: e.target.value })} aria-label="근무 형태 필터"><option>전체 근무형태</option><option>하이브리드</option><option>재택</option><option>대면</option></select><select value={filters.size} onChange={(e) => setFilters({ ...filters, size: e.target.value })} aria-label="기업 규모 필터"><option>전체 기업규모</option><option>대기업</option><option>중견기업</option><option>스타트업</option></select><label className={`check-filter ${filters.salary ? "checked" : ""}`}><input type="checkbox" checked={filters.salary} onChange={(e) => setFilters({ ...filters, salary: e.target.checked })} /> 급여 정보 있음</label></div><div className="active-filter-note">추천순은 충청권, 신입 가능, 마감 임박, 하이브리드·재택, 기업 규모, 급여 공개, 전공 역량을 함께 반영해요.</div></div>
      {displayedJobs.length ? <div className="job-grid">{displayedJobs.map((job) => <article className="job-card" key={job.id} onClick={() => setActiveJob(job)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setActiveJob(job)}><div className="card-top"><div className="company-logo" style={{ background: job.accent }}>{job.logo}</div><button className={`save-button ${saved.includes(job.id) ? "saved" : ""}`} onClick={(e) => { e.stopPropagation(); toggleSaved(job.id); }} aria-label={`${job.company} 공고 ${saved.includes(job.id) ? "저장 취소" : "저장"}`}>{saved.includes(job.id) ? "★" : "☆"}</button></div><div className="match"><strong>{recommendationScore(job)}점</strong> 추천 · {job.region} 우선</div><h3>{job.role}</h3><p className="company-name">{job.company}</p><div className="job-meta"><span>{job.type}</span><span>{job.location}</span></div><div className="card-badges"><span>{job.workMode}</span><span>{job.size}</span>{job.salary && <span className="salary-badge">급여 공개</span>}</div><div className="card-bottom"><div className="tag-list">{job.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div><span className="deadline">{job.deadline}</span></div></article>)}</div> : <div className="empty-state"><span>⌕</span><h3>{showSaved ? "저장한 공고가 없어요" : "조건에 맞는 공고가 없어요"}</h3><p>필터를 초기화하거나 다른 키워드로 찾아보세요.</p><button onClick={resetFilters}>필터 초기화</button></div>}
      <div className="saved-compare" id="saved"><div><p className="section-kicker">SAVE & COMPARE</p><h2>저장한 공고, 한눈에 비교하기</h2><p className="muted">관심 공고를 저장하고 지원 전 메모를 남겨보세요.</p></div><div className="compare-strip">{savedJobs.slice(0, 3).map((job) => <button className="compare-chip" key={job.id} onClick={() => setActiveJob(job)}><span className="chip-logo" style={{ background: job.accent }}>{job.logo}</span><span><strong>{job.company}</strong><small>{job.role}</small></span><b>{job.deadline}</b></button>)}{savedJobs.length === 0 && <span className="muted">저장한 공고를 추가하면 여기에 보여요.</span>}</div></div>
    </section>
    <section className="insight" id="guide"><div className="insight-inner"><div><p className="section-kicker">CAREER INSIGHT</p><h2>첫 지원, 막막하지 않도록</h2><p>대학생을 위한 이력서부터 면접까지,<br />작은 팁 하나도 쉽게 알려드릴게요.</p><a className="text-link light" href="#guide">가이드 둘러보기 <span>→</span></a></div><div className="insight-cards"><div className="mini-card"><span>01</span><strong>신입 자소서<br />첫 문장 쓰기</strong><b>→</b></div><div className="mini-card yellow"><span>02</span><strong>인턴 경험을<br />강점으로 바꾸는 법</strong><b>→</b></div></div></div></section>
    <footer><div className="footer-inner"><a className="brand" href="#top"><span className="brand-mark">+</span> 커리어픽</a><span>대학생의 첫 커리어를 응원합니다.</span><span className="copyright">© 2026 Careerpick</span></div></footer>
    {activeJob && <div className="modal-backdrop" role="presentation" onClick={() => setActiveJob(null)}><section className="job-modal" role="dialog" aria-modal="true" aria-labelledby="job-modal-title" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setActiveJob(null)} aria-label="상세 닫기">×</button><div className="modal-company"><div className="company-logo" style={{ background: activeJob.accent }}>{activeJob.logo}</div><div><p>{activeJob.company}</p><span>{activeJob.region} · {activeJob.location}</span></div></div><div className="modal-score">추천 점수 <strong>{recommendationScore(activeJob)}점</strong><span>{activeJob.deadline}</span></div><h2 id="job-modal-title">{activeJob.role}</h2><p className="modal-description">{activeJob.description}</p><div className="detail-grid"><div><small>고용 형태</small><strong>{activeJob.type}</strong></div><div><small>근무 방식</small><strong>{activeJob.workMode}</strong></div><div><small>기업 규모</small><strong>{activeJob.size}</strong></div><div><small>급여</small><strong>{activeJob.salary ?? ""}</strong></div></div><div className="detail-columns"><div><h4>지원 조건</h4><ul>{activeJob.requirements.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>우대 사항</h4><ul>{activeJob.preferred.map((item) => <li key={item}>{item}</li>)}</ul></div></div><label className="note-field">지원 전 메모<textarea value={notes[activeJob.id] ?? ""} onChange={(e) => updateNote(activeJob.id, e.target.value)} placeholder="확인할 점이나 지원 이유를 적어보세요." /></label><div className="modal-actions"><button className={`save-large ${saved.includes(activeJob.id) ? "saved" : ""}`} onClick={() => toggleSaved(activeJob.id)}>{saved.includes(activeJob.id) ? "★ 저장됨" : "☆ 저장하기"}</button><button className="close-large" onClick={() => setActiveJob(null)}>닫기</button></div></section></div>}
    {notice && <div className="toast" role="status">{notice}</div>}
  </main>;
}
