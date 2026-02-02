import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";

export default function Creators() {
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

  return (
    <div className="container">
      <div className="topBar">
        <h2 className="h2">Creators</h2>
      </div>

      {loading && <p className="smallMuted">Loading creators…</p>}
      {errorMsg && <p className="error">{errorMsg}</p>}

      <div className="grid">
        {creators.map((c) => (
          <Link key={c.id} className="viewCard" to={`/creators/${c.id}`}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{c.name}</div>
            <div className="smallMuted" style={{ marginTop: 8 }}>
              {c.description || "No description"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
