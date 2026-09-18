'use client';

import { FormEvent, useRef, useState } from 'react';
import { fetchSite, normalizeAddress, SitePage } from '@/lib/api';

type View =
  | { kind: 'idle' }
  | { kind: 'loading'; address: string }
  | { kind: 'page'; page: SitePage }
  | { kind: 'missing'; address: string }
  | { kind: 'error'; message: string };

export function Browser() {
  const [typed, setTyped] = useState('');
  const [view, setView] = useState<View>({ kind: 'idle' });
  const frameRef = useRef<HTMLIFrameElement>(null);

  async function go(raw: string) {
    const address = normalizeAddress(raw);
    if (!address) {
      return;
    }

    setTyped(address);
    setView({ kind: 'loading', address });

    try {
      const result = await fetchSite(address);
      if (result.missing || !result.page) {
        setView({ kind: 'missing', address });
        return;
      }
      setView({ kind: 'page', page: result.page });
    } catch (error) {
      setView({
        kind: 'error',
        message:
          error instanceof Error ? error.message : 'Could not load that address',
      });
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void go(typed);
  }

  function onFrameLoad() {
    const doc = frameRef.current?.contentDocument;
    if (!doc) {
      return;
    }

    doc.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          void go(href);
        }
      });
    });
  }

  return (
    <div className="browser">
      <form className="chrome" onSubmit={onSubmit}>
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

      <section className="page">
        {view.kind === 'idle' && (
          <p className="status">Type an address and press Go.</p>
        )}
        {view.kind === 'loading' && (
          <p className="status">Loading {view.address}…</p>
        )}
        {view.kind === 'error' && <p className="status">{view.message}</p>}
        {view.kind === 'missing' && (
          <div className="missing">
            <h1>Nowhere</h1>
            <p>No such address: {view.address}</p>
          </div>
        )}
        {view.kind === 'page' && (
          <>
            <p className="byline">
              {view.page.title} · {view.page.authorName}
            </p>
            <iframe
              ref={frameRef}
              className="frame"
              title={view.page.title}
              sandbox="allow-same-origin"
              srcDoc={`<style>body{margin:24px;font-family:Georgia,serif;line-height:1.5;color:#16212c}a{color:#2e7bd6}</style>${view.page.body}`}
              onLoad={onFrameLoad}
            />
          </>
        )}
      </section>
    </div>
  );
}
