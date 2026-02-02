// src/pages/AddCreator.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";

import { FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function AddCreator() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    image_url: "",
    description: "",
    url: "",
    youtube: "",
    twitter: "",
    instagram: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const hasAtLeastOneSocial =
      !!form.youtube.trim() ||
      !!form.twitter.trim() ||
      !!form.instagram.trim() ||
      !!form.url.trim();

    if (!form.name.trim()) {
      setErrorMsg("Name is required.");
      return;
    }

    if (!hasAtLeastOneSocial) {
      setErrorMsg("Please provide at least one social media link.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      image_url: form.image_url.trim() || null,
      description: form.description.trim() || null,
      url: form.url.trim() || null,
      youtube: form.youtube.trim() || null,
      twitter: form.twitter.trim() || null,
      instagram: form.instagram.trim() || null,
    };

    const { error } = await supabase.from("creators").insert([payload]);
    if (error) {
      setErrorMsg(error.message);
      return;
    }

    navigate("/creators");
  };

  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div>
          <h1>CreatorVerse</h1>
          <div className="heroBtns">
            <Link to="/#creators" className="btn btnGlow">
              View All Creators
            </Link>
            <Link to="/new" className="btn">
              Add a Creator
            </Link>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="container">
        <h2 className="pageTitle">Add Creator</h2>

        <div className="formCard">
          {errorMsg && <p className="error">{errorMsg}</p>}

          <form className="form" onSubmit={handleSubmit}>
            {/* NAME */}
            <div className="field">
              <label className="label">
                Name <span className="req">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* IMAGE */}
            <div className="field">
              <label className="label">Image</label>
              <div className="help">
                Provide a link to an image of your creator. Be sure to include
                http:// or https://
              </div>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="field">
              <label className="label">Description</label>
              <div className="help">
                Provide a description of the creator. Who are they? What makes
                them interesting?
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* SOCIALS */}
            <div className="section">
              <div className="sectionTitle">SOCIAL MEDIA LINKS</div>
              <div className="sectionHint">
                Provide at least one of the creator&apos;s social media links.
              </div>

              {/* YouTube */}
              <div className="field">
                <div className="formSocialHeader">
                  <span className="formIcon" aria-hidden="true">
                    <FaYoutube />
                  </span>
                  <div>
                    <div className="formSocialLabel">YouTube</div>
                    <div className="formSocialHelp">
                      The creator&apos;s YouTube handle (without the @)
                    </div>
                  </div>
                </div>

                <input
                  name="youtube"
                  value={form.youtube}
                  onChange={handleChange}
                />
              </div>

              {/* Twitter / X */}
              <div className="field">
                <div className="formSocialHeader">
                  <span className="formIcon" aria-hidden="true">
                    <FaXTwitter />
                  </span>
                  <div>
                    <div className="formSocialLabel">Twitter</div>
                    <div className="formSocialHelp">
                      The creator&apos;s Twitter handle (without the @)
                    </div>
                  </div>
                </div>

                <input
                  name="twitter"
                  value={form.twitter}
                  onChange={handleChange}
                />
              </div>

              {/* Instagram */}
              <div className="field">
                <div className="formSocialHeader">
                  <span className="formIcon" aria-hidden="true">
                    <FaInstagram />
                  </span>
                  <div>
                    <div className="formSocialLabel">Instagram</div>
                    <div className="formSocialHelp">
                      The creator&apos;s Instagram handle (without the @)
                    </div>
                  </div>
                </div>

                <input
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                />
              </div>

              {/* Website */}
              <div className="field">
                <label className="label">Website / Other URL (optional)</label>
                <input name="url" value={form.url} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn btnGlow submitWide">
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
