import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../client";

export default function EditCreator() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [url, setUrl] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return setErrorMsg(error.message);

      setName(data?.name ?? "");
      setImageUrl(data?.image_url ?? "");
      setDescription(data?.description ?? "");

      setUrl(data?.url ?? "");
      setYoutube(data?.youtube ?? "");
      setTwitter(data?.twitter ?? "");
      setInstagram(data?.instagram ?? "");
    };

    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const hasAtLeastOneSocial =
      !!youtube.trim() ||
      !!twitter.trim() ||
      !!instagram.trim() ||
      !!url.trim();

    if (!name.trim()) return setErrorMsg("Name is required.");
    if (!hasAtLeastOneSocial)
      return setErrorMsg(
        "Please provide at least one social media link (or Website/Other URL)."
      );

    const payload = {
      name: name.trim(),
      image_url: imageUrl.trim() || null,
      description: description.trim() || null,
      url: url.trim() || null,
      youtube: youtube.trim() || null,
      twitter: twitter.trim() || null,
      instagram: instagram.trim() || null,
    };

    const { error } = await supabase
      .from("creators")
      .update(payload)
      .eq("id", id);
    if (error) return setErrorMsg(error.message);

    navigate("/creators");
  };

  return (
    <div className="container">
      <div className="formHeader">
        <h2 className="pageTitle">Edit Creator</h2>
        <div className="formHeaderBtns">
          <Link className="btn" to="/creators">
            Back
          </Link>
        </div>
      </div>

      <div className="formCard">
        {errorMsg && (
          <p className="error" style={{ marginTop: 0 }}>
            {errorMsg}
          </p>
        )}

        <form onSubmit={submit} className="form">
          <div className="field">
            <label className="label">
              Name <span className="req">*</span>
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field">
            <label className="label">Image</label>
            <div className="help">Include http:// or https://</div>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="section">
            <div className="sectionTitle">SOCIAL MEDIA LINKS</div>
            <div className="sectionHint">Provide at least one.</div>

            <div className="field">
              <label className="label">YouTube URL</label>
              <input
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Twitter/X URL</label>
              <input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Instagram URL</label>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Website / Other URL (optional)</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          </div>

          <button className="btn btnGlow submitWide" type="submit">
            SAVE
          </button>
        </form>
      </div>
    </div>
  );
}
