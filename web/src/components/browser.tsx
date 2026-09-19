'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  fetchHistory,
  fetchPeople,
  fetchSearch,
  fetchSite,
  HistoryRow,
  normalizeAddress,
  PersonRow,
  recordVisit,
  SearchHit,
  SitePage,
  VisitWay,
} from '@/lib/api';

type Shown =
  | { kind: 'idle' }
  | { kind: 'loading'; address: string }
  | { kind: 'page'; page: SitePage }
  | { kind: 'missing'; address: string }
  | { kind: 'results'; query: string; rows: SearchHit[] }
  | { kind: 'error'; message: string };

type SessionEntry = {
  address: string;
  shown: Extract<Shown, { kind: 'page' } | { kind: 'missing' }>;
  scroll: number;
};

export function Browser() {
  const [people, setPeople] = useState<PersonRow[]>([]);
  const [personId, setPersonId] = useState('');
  const [typed, setTyped] = useState('');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState<Shown>({ kind: 'idle' });
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [index, setIndex] = useState(-1);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const stackRef = useRef<SessionEntry[]>([]);
  const indexRef = useRef(-1);
  const personIdRef = useRef('');
  const pendingScroll = useRef(0);

  useEffect(() => {
    void (async () => {
      try {
        const rows = await fetchPeople();
        setPeople(rows);
        if (rows[0]) {
          personIdRef.current = rows[0].id;
          setPersonId(rows[0].id);
          setHistory(await fetchHistory(rows[0].id));
        }
      } catch (error) {
        setShown({
          kind: 'error',
          message:
            error instanceof Error ? error.message : 'Could not load people',
        });
      }
    })();
  }, []);

  function saveScroll() {
    const current = stackRef.current[indexRef.current];
    const doc = frameRef.current?.contentDocument;
    if (current && doc) {
      current.scroll = doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    }
  }

  function display(entry: SessionEntry) {
    pendingScroll.current = entry.scroll;
    setTyped(entry.address);
    setShown(entry.shown);
  }

  async function remember(address: string, via: VisitWay) {
    const id = personIdRef.current;
    if (!id) {
      return;
    }
    try {
      await recordVisit({ personId: id, address, via });
      setHistory(await fetchHistory(id));
    } catch {
      // The page still shows even if history could not be saved.
    }
  }

  async function load(address: string, via: Exclude<VisitWay, 'back' | 'forward'>) {
    setTyped(address);
    setShown({ kind: 'loading', address });

    try {
      const result = await fetchSite(address);
      const shownView: SessionEntry['shown'] =
        result.missing || !result.page
          ? { kind: 'missing', address }
          : { kind: 'page', page: result.page };
      const entry: SessionEntry = { address, shown: shownView, scroll: 0 };
      const kept = stackRef.current.slice(0, indexRef.current + 1);
      stackRef.current = [...kept, entry];
      indexRef.current = stackRef.current.length - 1;
      setIndex(indexRef.current);
      pendingScroll.current = 0;
      setShown(shownView);
      await remember(address, via);
    } catch (error) {
      setShown({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'Could not load that address',
      });
    }
  }

  async function go(raw: string, via: VisitWay) {
    const address = normalizeAddress(raw);
    if (!address) {
      return;
    }

    saveScroll();

    if (via === 'back') {
      if (indexRef.current <= 0) {
        return;
      }
      indexRef.current -= 1;
      setIndex(indexRef.current);
      const entry = stackRef.current[indexRef.current];
      display(entry);
      await remember(entry.address, 'back');
      return;
    }

    if (via === 'forward') {
      if (indexRef.current >= stackRef.current.length - 1) {
        return;
      }
      indexRef.current += 1;
      setIndex(indexRef.current);
      const entry = stackRef.current[indexRef.current];
      display(entry);
      await remember(entry.address, 'forward');
      return;
    }

    await load(address, via);
  }

  async function onPersonChange(id: string) {
    personIdRef.current = id;
    setPersonId(id);
    stackRef.current = [];
    indexRef.current = -1;
    setIndex(-1);
    setTyped('');
    setQuery('');
    setShown({ kind: 'idle' });
    try {
      setHistory(await fetchHistory(id));
    } catch {
      setHistory([]);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void go(typed, 'typed');
  }

  async function onSearch(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) {
      return;
    }
    try {
      const rows = await fetchSearch(q);
      setShown({ kind: 'results', query: q, rows });
    } catch (error) {
      setShown({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Could not search',
      });
    }
  }

  function onFrameLoad() {
    const doc = frameRef.current?.contentDocument;
    if (!doc) {
      return;
    }

    doc.documentElement.scrollTop = pendingScroll.current;
    doc.body.scrollTop = pendingScroll.current;

    doc.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          void go(href, 'link');
        }
      });
    });
  }

  const canBack = index > 0;
  const canForward = index >= 0 && index < stackRef.current.length - 1;

  return (
    <div className="shell">
      <div className="browser">
        <div className="chrome">
          <form className="chrome-row" onSubmit={onSubmit}>
            <label className="address-label" htmlFor="person">
              Browsing as
            </label>
            <select
              id="person"
              className="person"
              value={personId}
              onChange={(event) => void onPersonChange(event.target.value)}
            >
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            <button
              className="nav"
              type="button"
              disabled={!canBack}
              onClick={() => void go(typed, 'back')}
            >
              Back
            </button>
            <button
              className="nav"
              type="button"
              disabled={!canForward}
              onClick={() => void go(typed, 'forward')}
            >
              Forward
            </button>
            <label className="address-label" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              className="address"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              placeholder="tidepool.zz"
              autoComplete="off"
              spellCheck={false}
            />
            <button className="go" type="submit">
              Go
            </button>
          </form>
          <form className="chrome-row" onSubmit={(event) => void onSearch(event)}>
            <label className="address-label" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              className="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="oranges"
              autoComplete="off"
              spellCheck={false}
            />
            <button className="go" type="submit">
              Search
            </button>
          </form>
        </div>

        <section className="page">
          {shown.kind === 'idle' && (
            <p className="status">Type an address and press Go.</p>
          )}
          {shown.kind === 'loading' && (
            <p className="status">Loading {shown.address}…</p>
          )}
          {shown.kind === 'error' && <p className="status">{shown.message}</p>}
          {shown.kind === 'missing' && (
            <div className="missing">
              <h1>Nowhere</h1>
              <p>No such address: {shown.address}</p>
            </div>
          )}
          {shown.kind === 'results' && (
            <div className="results">
              <h1>Search</h1>
              <p>Pages that contain “{shown.query}”</p>
              {shown.rows.length === 0 && (
                <p className="status">No pages match.</p>
              )}
              <ul className="results-list">
                {shown.rows.map((row) => (
                  <li key={row.address}>
                    <button
                      type="button"
                      className="history-item"
                      onClick={() => void go(row.address, 'search')}
                    >
                      <span className="history-address">{row.address}</span>
                      <span className="history-meta">{row.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {shown.kind === 'page' && (
            <>
              <p className="byline">
                {shown.page.title} · {shown.page.authorName}
              </p>
              <iframe
                ref={frameRef}
                className="frame"
                title={shown.page.title}
                sandbox="allow-same-origin"
                srcDoc={`<style>body{margin:24px;font-family:Georgia,serif;line-height:1.5;color:#16212c}a{color:#2e7bd6}</style>${shown.page.body}`}
                onLoad={onFrameLoad}
              />
            </>
          )}
        </section>
      </div>

      <aside className="history">
        <h2>History</h2>
        <p className="history-note">This name only. Click a row to go there.</p>
        <ol className="history-list">
          {history.length === 0 && <li className="history-empty">No visits yet.</li>}
          {history.map((row, i) => (
            <li key={`${row.at}-${row.address}-${i}`}>
              <button
                type="button"
                className="history-item"
                onClick={() => void go(row.address, 'history')}
              >
                <span className="history-address">{row.address}</span>
                <span className="history-meta">
                  {row.via} · {new Date(row.at).toLocaleString()}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
