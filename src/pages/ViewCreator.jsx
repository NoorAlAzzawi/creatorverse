import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";

import { FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";

export default function ViewCreator() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setErrorMsg(error.message);
        setCreator(null);
        setLoading(false);
        return;
      }

      setCreator(data);
      setLoading(false);
    };

    run();
  }, [id]);

  const deleteCreator = async () => {
    const ok = confirm("Delete this creator?");
    if (!ok) return;

    const { error } = await supabase.from("creators").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    navigate("/creators");
  };

  const normalize = (platform, value) => {
    if (!value) return null;
    const v = String(value).trim();
    if (!v) return null;

    const isUrl = /^https?:\/\//i.test(v);

    if (platform === "youtube") {
      return isUrl
        ? { href: v, display: v.replace(/^https?:\/\/(www\.)?/i, "") }
        : {
            href: `https://www.youtube.com/@${v.replace(/^@/, "")}`,
            display: `@${v.replace(/^@/, "")}`,
          };
    }

    if (platform === "twitter") {
      return isUrl
        ? { href: v, display: v.replace(/^https?:\/\/(www\.)?/i, "") }
        : {
            href: `https://x.com/${v.replace(/^@/, "")}`,
            display: `@${v.replace(/^@/, "")}`,
          };
    }

    if (platform === "instagram") {
      return isUrl
        ? { href: v, display: v.replace(/^https?:\/\/(www\.)?/i, "") }
        : {
            href: `https://www.instagram.com/${v.replace(/^@/, "")}`,
            display: `@${v.replace(/^@/, "")}`,
          };
    }

    return isUrl
      ? { href: v, display: v.replace(/^https?:\/\/(www\.)?/i, "") }
      : { href: `https://${v}`, display: v };
  };

  const socials = useMemo(() => {
    if (!creator) return [];

    const yt = normalize("youtube", creator.youtube);
    const tw = normalize("twitter", creator.twitter);
    const ig = normalize("instagram", creator.instagram);
    const site = normalize("url", creator.url);

    return [
      yt && { icon: <FaYoutube />, label: "YouTube", ...yt },
      tw && { icon: <FaXTwitter />, label: "Twitter", ...tw },
      ig && { icon: <FaInstagram />, label: "Instagram", ...ig },
      site && { icon: <FiExternalLink />, label: "Link", ...site },
    ].filter(Boolean);
  }, [creator]);

  if (loading) {
    return (
      <div className="container">
        <p className="smallMuted">Loading…</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="container">
        <p className="error">{errorMsg}</p>
        <Link className="btn btnGlow" to="/creators">
          Back to Creators
        </Link>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="container">
        <p className="smallMuted">Creator not found.</p>
        <Link className="btn btnGlow" to="/creators">
          Back to Creators
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="viewShell">
        <div className="viewPanel">
          {/* LEFT IMAGE */}
          <div className="viewImgCol">
            <div
              className="viewImgFrame"
              style={{
                backgroundImage: creator.image_url
                  ? `url(${creator.image_url})`
                  : "none",
              }}
            >
              {!creator.image_url && (
                <div className="viewImgPlaceholder">No Image</div>
              )}
            </div>
          </div>

          {/* RIGHT INFO */}
          <div className="viewInfoCol">
            <h2 className="viewName">{creator.name}</h2>

            {creator.description && (
              <p className="viewDesc">{creator.description}</p>
            )}

            {/* SOCIAL ROWS */}
            {socials.length > 0 && (
              <div className="viewSocialList">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    className="viewSocialRow"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    title={s.href}
                  >
                    <span className="viewSocialIcon" aria-hidden="true">
                      {s.icon}
                    </span>
                    <span className="viewSocialText">{s.display}</span>
                  </a>
                ))}
              </div>
            )}

            {/* BUTTONS */}
            <div className="viewActions">
              <Link className="viewBtn viewBtnEdit" to={`/creators/${id}/edit`}>
                EDIT
              </Link>

              <button className="viewBtn viewBtnDelete" onClick={deleteCreator}>
                DELETE
              </button>
            </div>

            <div className="viewBackRow">
              <Link className="viewBack" to="/creators">
                ← Back to creators
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
