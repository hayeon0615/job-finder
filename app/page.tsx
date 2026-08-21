"use client";

import { useMemo, useState } from "react";

type Job = { id: number; company: string; role: string; type: string; deadline: string; location: string; tags: string[]; accent: string; logo: string; match: number };

const jobs: Job[] = [
  { id: 1, company: "토스", role: "Product Designer Internship", type: "인턴", deadline: "D-8", location: "서울 강남구 · 하이브리드", tags: ["UX/UI", "서비스기획"], accent: "#d9efff", logo: "toss", match: 98 },
  { id: 2, company: "오늘의집", role: "콘텐츠 마케팅 인턴", type: "인턴", deadline: "D-12", location: "서울 서초구", tags: ["마케팅", "콘텐츠"], accent: "#e4f5e9", logo: "오늘", match: 94 },
  { id: 3, company: "무신사", role: "Brand Experience Assistant", type: "계약직", deadline: "D-5", location: "서울 성동구", tags: ["브랜딩", "패션"], accent: "#f2e9ff", logo: "M", match: 91 },
  { id: 4, company: "당근", role: "Community Operations 인턴", type: "인턴", deadline: "D-18", location: "서울 서초구 · 하이브리드", tags: ["커뮤니티", "운영"], accent: "#fff0d9", logo: "당근", match: 88 },
  { id: 5, company: "네이버웹툰", role: "글로벌 콘텐츠 운영 인턴", type: "인턴", deadline: "D-21", location: "경기 성남시", tags: ["콘텐츠", "글로벌"], accent: "#e7f7de", logo: "N", match: 86 },
  { id: 6, company: "29CM", role: "MD Assistant · 리빙", type: "인턴", deadline: "D-3", location: "서울 마포구", tags: ["MD", "리빙"], accent: "#ffe7e3", logo: "29", match: 84 },
];
const filters = ["전체", "기획·PM", "마케팅", "디자인", "개발", "콘텐츠"];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([2]);
  const [notice, setNotice] = useState("");
  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const matchesFilter = activeFilter === "전체" || job.tags.some((tag) => tag.includes(activeFilter.replace("·", "")));
    const q = query.trim().toLowerCase();
    return matchesFilter && (!q || `${job.company} ${job.role} ${job.tags.join(" ")}`.toLowerCase().includes(q));
  }), [activeFilter, query]);
  function toggleSaved(id: number) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setNotice(saved.includes(id) ? "저장 목록에서 삭제했어요." : "저장했어요. 마이페이지에서 확인할 수 있어요.");
    window.setTimeout(() => setNotice(""), 2200);
  }
  return <main>
    <nav className="topbar"><div className="nav-inner"><a className="brand" href="#top"><span className="brand-mark">+</span> 커리어픽</a><div className="nav-links"><a className="active" href="#jobs">공고 탐색</a><a href="#saved">저장한 공고 <span className="nav-count">{saved.length}</span></a><a href="#guide">취업 가이드</a></div><button className="profile-button" aria-label="내 프로필 열기"><span className="avatar">김</span><span>내 프로필</span><span className="chevron">⌄</span></button></div></nav>
    <section className="hero" id="top"><div className="hero-inner"><div className="hero-copy"><p className="eyebrow"><span className="spark">✦</span> 나에게 맞는 첫 커리어</p><h1>이번 주, <em>나답게</em> 시작할<br />기회를 찾아보세요.</h1><p className="hero-description">전공과 관심사를 바탕으로 엄선한 대학생 맞춤 공고를<br className="desktop-only" /> 매주 새롭게 추천해드려요.</p></div><div className="hero-art" aria-hidden="true"><div className="sun"></div><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="plant"><i></i><i></i><b></b></div><div className="paper paper-one">CAREER<br /><strong>START</strong></div><div className="paper paper-two">✦</div><div className="sticker">YOUR<br />NEXT<br /><strong>MOVE</strong></div></div></div></section>
    <section className="content" id="jobs"><div className="section-heading"><div><p className="section-kicker">CURATED FOR YOU</p><h2>오늘의 추천 공고</h2><p className="muted">회원님의 관심사와 잘 맞는 공고예요.</p></div><a className="text-link" href="#all">전체 공고 보기 <span>→</span></a></div><div className="controls"><div className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="직무, 기업명, 키워드로 찾아보세요" aria-label="공고 검색" />{query && <button onClick={() => setQuery("")} aria-label="검색어 지우기">×</button>}</div><div className="filter-row" role="tablist" aria-label="직무 필터">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? "selected" : ""} onClick={() => setActiveFilter(filter)} role="tab" aria-selected={activeFilter === filter}>{filter}</button>)}</div></div><div className="job-grid">{filteredJobs.map((job) => <article className="job-card" key={job.id}><div className="card-top"><div className="company-logo" style={{ background: job.accent }}>{job.logo}</div><button className={`save-button ${saved.includes(job.id) ? "saved" : ""}`} onClick={() => toggleSaved(job.id)} aria-label={`${job.company} 공고 ${saved.includes(job.id) ? "저장 취소" : "저장"}`}>{saved.includes(job.id) ? "★" : "☆"}</button></div><div className="match">회원님과 <strong>{job.match}%</strong> 잘 맞아요</div><h3>{job.role}</h3><p className="company-name">{job.company}</p><div className="job-meta"><span>{job.type}</span><span>{job.location}</span></div><div className="card-bottom"><div className="tag-list">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><span className="deadline">{job.deadline}</span></div></article>)}</div>{filteredJobs.length === 0 && <div className="empty-state"><span>⌕</span><h3>찾으시는 공고가 없어요</h3><p>다른 키워드나 직무로 검색해보세요.</p></div>}<div className="more-row"><button className="more-button" onClick={() => setNotice("새로운 추천 공고를 준비 중이에요.")}>추천 공고 더 보기 <span>＋</span></button></div></section>
    <section className="insight" id="guide"><div className="insight-inner"><div><p className="section-kicker">CAREER INSIGHT</p><h2>첫 지원, 막막하지 않도록</h2><p>대학생을 위한 이력서부터 면접까지,<br />작은 팁 하나도 쉽게 알려드릴게요.</p><a className="text-link light" href="#guide-content">가이드 둘러보기 <span>→</span></a></div><div className="insight-cards"><div className="mini-card"><span>01</span><strong>신입 자소서<br />첫 문장 쓰기</strong><b>→</b></div><div className="mini-card yellow"><span>02</span><strong>인턴 경험을<br />강점으로 바꾸는 법</strong><b>→</b></div></div></div></section>
    <footer><div className="footer-inner"><a className="brand" href="#top"><span className="brand-mark">+</span> 커리어픽</a><span>대학생의 첫 커리어를 응원합니다.</span><span className="copyright">© 2026 Careerpick</span></div></footer>{notice && <div className="toast" role="status">{notice}</div>}
  </main>;
}
