import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from '../parts/Header';
import Card from '../parts/Card';
import defaultAvatar from '../assets/tempuser.png';

// Import local preset avatars
import cosmicPic from '../assets/avatars/cosmic.png';
import cyberpunkPic from '../assets/avatars/cyberpunk.png';
import astronautPic from '../assets/avatars/astronaut.png';
import retroPic from '../assets/avatars/retro.png';
import mooncatPic from '../assets/avatars/mooncat.png';

const AVATAR_PRESETS = [
  { name: 'Cosmic', path: '/src/assets/avatars/cosmic.png', asset: cosmicPic },
  { name: 'Cyberpunk', path: '/src/assets/avatars/cyberpunk.png', asset: cyberpunkPic },
  { name: 'Astronaut', path: '/src/assets/avatars/astronaut.png', asset: astronautPic },
  { name: 'Retro', path: '/src/assets/avatars/retro.png', asset: retroPic },
  { name: 'Mooncat', path: '/src/assets/avatars/mooncat.png', asset: mooncatPic }
];

function User() {
  const [user, setUser] = useState(null);
  const [userGames, setUserGames] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPresetUrl, setSelectedPresetUrl] = useState("");
  const [customFile, setCustomFile] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfileData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Fetch user info
    fetch("http://localhost:3001/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then(data => {
        setUser(data);
        setUsername(data.username || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setSelectedPresetUrl(data.profile_pic || "");
        setIsLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });

    // Fetch user games
    fetch("http://localhost:3001/api/user/games", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setUserGames(data);
      })
      .catch(err => console.error("Error loading user games:", err));
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("bio", bio);
    if (password) {
      formData.append("password", password);
    }

    if (customFile) {
      formData.append("profilePic", customFile);
    } else {
      formData.append("avatarUrl", selectedPresetUrl);
    }

    try {
      const response = await fetch("http://localhost:3001/api/user/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setPassword("");
        setCustomFile(null);
        setTimeout(() => {
          setIsEditing(false);
          setSuccess("");
          fetchProfileData();
        }, 1500);
      } else {
        setError(data.error || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to transmit profile updates.");
    }
  };

  if (isLoading) {
    return (
      <div className="User">
        <Header />
        <div style={{ textAlign: 'center', marginTop: '100px', width: '100%' }}>
          <p>Decrypting profile credentials...</p>
        </div>
      </div>
    );
  }

  // Resolve profile picture url
  const getProfilePicUrl = () => {
    if (!user?.profile_pic) return defaultAvatar;
    if (user.profile_pic.startsWith("/uploads/")) {
      return `http://localhost:3001${user.profile_pic}`;
    }
    // Preset local asset map
    const matchedPreset = AVATAR_PRESETS.find(p => p.path === user.profile_pic);
    return matchedPreset ? matchedPreset.asset : user.profile_pic;
  };

  return (
    <div className="User">
      <Header />

      {/* Left Sidebar: User Games */}
      <div className='Sidebar'>
        <h4>My Games ({userGames.length})</h4>
        <div className="sidebar-scroll">
          {userGames.length > 0 ? (
            userGames.map(game => (
              <Card key={game.id} game={game} />
            ))
          ) : (
            <div style={{ padding: '20px 10px', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
              <p>No games published yet.</p>
              <button className="button" style={{ fontSize: '12px' }} onClick={() => window.location.href = "/Pagemaker"}>Create Page</button>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Profile Panel */}
      <div className='Profile'>
        {isEditing ? (
          <div className="Pagemaker_form" /*style={{ width: '100%', padding: '0', background: 'transparent', border: 'none' }}*/>
            <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#3b82f6', marginBottom: '15px' }}>Edit Transmitter</h2>
            <form onSubmit={handleUpdateProfile}>
              <div>
                <legend>Username</legend>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={30}
                />

                {/*<legend>Email</legend>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />*/}

                <legend>Bio</legend>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  maxLength={1000}
                ></textarea>

                <legend>Change Password (optional)</legend>
                <input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />

                <legend>Preset Cosmic Avatars</legend>
                <div style={{ display: 'flex', gap: '10px', margin: '10px 0', flexWrap: 'wrap' }}>
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => {
                        setSelectedPresetUrl(preset.path);
                        setCustomFile(null);
                      }}
                      style={{
                        background: 'transparent',
                        border: selectedPresetUrl === preset.path && !customFile ? '3px solid #3b82f6' : '1px solid #1e293b',
                        borderRadius: '50%',
                        padding: '2px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <img
                        src={preset.asset}
                        alt={preset.name}
                        style={{ width: '45px', height: '45px', borderRadius: '50%' }}
                        title={preset.name}
                      />
                    </button>
                  ))}
                </div>

                <legend>Or Upload Custom Avatar</legend>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setCustomFile(e.target.files[0]);
                    setSelectedPresetUrl(""); // clear preset selection
                  }}
                  style={{ border: 'none', background: 'transparent', padding: '5px 0' }}
                />
              </div>

              {error && <div className="error_message">{error}</div>}
              {success && <div className="success_message">{success}</div>}

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" className="button" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" className="button" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <p style={{ color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
              Rights: {user.role || "user"}
            </p>
            <img
              src={getProfilePicUrl()}
              alt="profile_pic"
              onError={(e) => { e.target.src = defaultAvatar; }}
              style={{ width: '130px', height: '130px', borderRadius: '50%', border: '2px solid #3b82f6', objectFit: 'cover', margin: '20px 0' }}
            />
            <h3>{user.username}</h3>
            <div className='Line'></div>
            <h4>Bio</h4>
            <p className="bio">
              {user.bio || "No transmission description recorded for this user profile."}
            </p>
            <button className='white_btn button' onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </div>

      {/* Right Sidebar: Empty/Spacer */}
      <div className='Sidebar'>
      </div>
    </div>
  );
}

export default User;