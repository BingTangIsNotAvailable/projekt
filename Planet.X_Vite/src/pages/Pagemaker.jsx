import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from '../parts/Header';
import { useNavigate } from 'react-router-dom';

function Pagemaker() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [price, setPrice] = useState("0");
  const [gameFile, setGameFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
      return;
    }

    // Fetch genres
    fetch(`${window.API_URL}/api/genres`)
      .then(res => res.json())
      .then(data => {
        setGenres(data);
        if (data.length > 0) {
          setGenreId(data[0].id);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load genres.");
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!gameFile) {
      setError("Please select a game file to upload.");
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre_id", genreId);
    formData.append("platform", platform);
    formData.append("price", parseFloat(price) || 0);
    formData.append("gameFile", gameFile);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const response = await fetch(`${window.API_URL}/api/games`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Game uploaded successfully!");
        setTimeout(() => {
          navigate(`/Game/${data.gameId}`);
        }, 1500);
      } else {
        setError(data.error || "Failed to create game page.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Pagemaker">
      <Header />
      <div className='Pagemaker_content'>
        <h1>Create your own game page!</h1>
        <div className='Pagemaker_form'>
          <form onSubmit={handleSubmit}>
            <div>
              <legend>Title</legend>
              <input
                type="text"
                placeholder="Game Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                maxLength={50}
                disabled={isLoading}
              />

              <legend>Description</legend>
              <textarea
                placeholder="Tell players about your game (gameplay, controls, instructions)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                cols="30"
                rows="8"
                maxLength={5000}
                disabled={isLoading}
              ></textarea>

              <legend>Genre</legend>
              <select
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
                disabled={isLoading}
              /*style={{ width: '100%', padding: '10px', background: '#0b0f19', border: '1px solid #1e293b', color: '#fff', borderRadius: '5px', marginBottom: '15px' }}*/
              >
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>

              <legend>Platform</legend>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                disabled={isLoading}
              /*style={{ width: '100%', padding: '10px', background: '#0b0f19', border: '1px solid #1e293b', color: '#fff', borderRadius: '5px', marginBottom: '15px' } }*/
              >
                <option value="PC">PC</option>
                <option value="Mac">Mac</option>
                <option value="Linux">Linux</option>
                <option value="Web">Web Browser</option>
                <option value="Mobile">Mobile (Android/iOS)</option>
                <option value="Console">Console (PlayStation/Xbox/Switch)</option>
              </select>

              <legend>Price ($) [not yet implemented]</legend>
              <input
                type="number"
                min="0"
                max="0" /* delete this line once price is implemented */
                step="0.01"
                placeholder="0.00 for free"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={isLoading}
              />

              <legend>Game File (.zip, .exe, etc.)</legend>
              <input
                type="file"
                onChange={(e) => setGameFile(e.target.files[0])}
                required
                disabled={isLoading}
                style={{ border: 'none', background: 'transparent', padding: '5px 0' }}
              />

              <legend>Cover Image (Optional)</legend>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                disabled={isLoading}
                style={{ border: 'none', background: 'transparent', padding: '5px 0' }}
              />
            </div>

            {error && <div style={{ color: '#f87171', margin: '10px 0', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: '#4ade80', margin: '10px 0', fontSize: '14px', textAlign: 'center' }}>{success}</div>}

            <button type="submit" className='btn button' disabled={isLoading} style={{ marginTop: '20px', width: '100%' }}>
              {isLoading ? "Uploading Game Files..." : "Publish Page"}
            </button>
          </form>
        </div>
      </div >
    </div >
  );
}

export default Pagemaker;