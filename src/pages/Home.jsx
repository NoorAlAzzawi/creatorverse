// pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";

const SvgYouTube = (props) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.5V8.5l6.2 3.5-6.2 3.5Z"
    />
  </svg>
);

const SvgTwitter = (props) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M18.9 2H22l-6.8 7.8L23.2 22h-6.7l-5.2-6.8L5.7 22H2.6l7.3-8.4L1 2h6.9l4.7 6.1L18.9 2Zm-1.2 18h1.7L7.8 3.9H6l11.7 16.1Z"
    />
  </svg>
);

const SvgInstagram = (props) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5Zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5ZM18 6.7a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"
    />
  </svg>
);

export default function Home() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .order("id", { ascending: true });

      if (error) setErrorMsg(error.message);
      setCreators(data ?? []);
      setLoading(false);
    };

    run();
  }, []);

  const icon = (href, label, Comp) => (
    <a
      className="socialIcon"
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label}
    >
      <Comp />
    </a>
  );

  const autoSocialIcons = (c) => {
    const out = [];
    if (c.youtube) out.push(icon(c.youtube, "YouTube", SvgYouTube));
    if (c.twitter) out.push(icon(c.twitter, "Twitter/X", SvgTwitter));
    if (c.instagram) out.push(icon(c.instagram, "Instagram", SvgInstagram));

    // fallback: single url column
    if (!out.length && c.url) {
      const u = String(c.url).toLowerCase();
      if (u.includes("youtube.com") || u.includes("youtu.be"))
        out.push(icon(c.url, "YouTube", SvgYouTube));
      else if (u.includes("twitter.com") || u.includes("x.com"))
        out.push(icon(c.url, "Twitter/X", SvgTwitter));
      else if (u.includes("instagram.com"))
        out.push(icon(c.url, "Instagram", SvgInstagram));
    }
    return out;
  };

  return (
    <>
      <div className="hero">
        <div>
          <h1>CreatorVerse</h1>
          <div className="heroBtns">
            <a className="btn btnGlow" href="#creators">
              View All Creators
            </a>
            <Link className="btn" to="/new">
              Add a Creator
            </Link>
          </div>
        </div>
      </div>

      <div id="creators" className="container" style={{ paddingTop: 10 }}>
        <div className="topBar">
          <h2 className="h2">Creators</h2>
        </div>

        {loading && <p className="smallMuted">Loading creators…</p>}
        {errorMsg && <p className="error">{errorMsg}</p>}

        <div className="grid">
          {creators.map((c) => {
            const img = (c.image_url || "").trim();
            const bg = img
              ? `url(${img})`
              : "radial-gradient(700px 320px at 20% 20%, rgba(124,92,255,.35), transparent 60%), radial-gradient(700px 320px at 80% 80%, rgba(79,209,197,.25), transparent 60%)";

            const socials = autoSocialIcons(c);

            return (
              <div key={c.id} className="card">
                <div className="cardBg" style={{ backgroundImage: bg }} />
                <div className="cardShade" />

                {socials.length > 0 && (
                  <div className="socialRow">{socials}</div>
                )}

                <div className="actionRow">
                  <Link
                    className="actionIcon"
                    to={`/creators/${c.id}`}
                    title="View"
                  >
                    i
                  </Link>
                  <Link
                    className="actionIcon"
                    to={`/creators/${c.id}/edit`}
                    title="Edit"
                  >
                    ✎
                  </Link>
                </div>

                <div className="cardInner">
                  <h3 className="cardTitle">{c.name}</h3>
                  <p className="desc">
                    {c.description ? c.description : "No description"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
