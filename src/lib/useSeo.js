import { useEffect } from "react";

function setMeta(name, content, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function useSeo({ title, description, path = "/" }) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ghscanner` : "ghscanner";
    document.title = fullTitle;
    if (description) {
      setMeta("description", description);
      setMeta("og:title", fullTitle, "property");
      setMeta("og:description", description, "property");
    }
    setMeta("og:url", `https://ghscanner.blackxploit.qzz.io${path}`, "property");

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://ghscanner.blackxploit.qzz.io${path}`);
  }, [title, description, path]);
}
