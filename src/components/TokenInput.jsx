import { useEffect, useState } from "react";

const SESSION_KEY = "ghscanner_token";

export default function TokenInput({ token, setToken }) {
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setToken(saved);
      setRemember(true);
    }

  }, []);

  useEffect(() => {
    if (remember && token) sessionStorage.setItem(SESSION_KEY, token);
    if (!remember) sessionStorage.removeItem(SESSION_KEY);
  }, [remember, token]);

  return (
    <div className="tokenSection">
      <button className="linklike" onClick={() => setShow((s) => !s)} type="button">
        {show ? "hide token field" : "use a personal access token (raises rate limit to 5,000/hr)"}
      </button>
      {show && (
        <div className="tokenBox">
          <input
            className="tokenInput"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_..."
            autoComplete="off"
          />
          <label className="rememberLabel">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember for this browser tab only
          </label>
          <p className="tokenNote">
            Sent directly to api.github.com from your browser, never to our
            server or stored in any database. Clears automatically when you
            close this tab unless you leave "remember" checked, in which case
            it stays only in this tab's session storage.
          </p>
        </div>
      )}
    </div>
  );
}
