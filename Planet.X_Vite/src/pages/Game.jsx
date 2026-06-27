import '../App.css';
import Header from '../parts/Header';
import defaultCover from '../assets/hi.jpg';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setIsLoading(true);
    // Fetch game details
    fetch(`${window.API_URL}/api/games/${id}`)
      .then(res => res.json())
      .then(data => {
        setGame(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });

    // Fetch current user details if logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${window.API_URL}/api/user`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch user");
        })
        .then(userData => setCurrentUser(userData))
        .catch(err => console.error("Error fetching user details:", err));
    }

    // Fetch comments
    fetch(`${window.API_URL}/api/games/${id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));

    // Fetch genres
    fetch(`${window.API_URL}/api/genres`)
      .then(res => res.json())
      .then(data => setGenres(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleDownload = () => {
    if (!game) return;
    // Trigger download endpoint directly
    window.open(`${window.API_URL}/api/games/${id}/download`, "_blank");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this game?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${window.API_URL}/api/games/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Game deleted successfully.");
        navigate("/Gamelist");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete game.");
      }
    } catch (err) {
      console.error(err);
      alert("Server communication failed.");
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    setCommentError("");
    setCommentSuccess("");

    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${window.API_URL}/api/games/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      });

      const data = await response.json();

      if (response.ok) {
        setCommentSuccess("Comment posted successfully!");
        setNewComment("");
        // Re-fetch comments
        fetch(`${window.API_URL}/api/games/${id}/comments`)
          .then(res => res.json())
          .then(data => setComments(data));
      } else {
        setCommentError(data.error || "Failed to post comment.");
      }
    } catch (err) {
      console.error(err);
      setCommentError("Server communication failed.");
    }
  };

  // Find genre name from genre_id
  const getGenreName = () => {
    if (!game || !game.genre_id) {
      // Fallback local mapping for mock games
      const title = game?.title?.toLowerCase() || "";
      if (title.includes("ultrakill") || title.includes("doom")) return "Action";
      if (title.includes("minecraft")) return "Survival";
      if (title.includes("stardew")) return "RPG";
      return "General";
    }
    const found = genres.find(g => g.id === game.genre_id);
    return found ? found.name : "Other";
  };

  if (isLoading) {
    return (
      <div className="Game">
        <Header />
        <div className="Middle" style={{ textAlign: 'center', marginTop: '100px' }}>
          <p>Loading game data transmission...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="Game">
        <Header />
        <div className="Middle" style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2>Transmission Lost</h2>
          <p>Game page could not be located in the Planet.X mainframe.</p>
          <Link to="/Gamelist" className="button" style={{ display: 'inline-block', marginTop: '15px' }}>Return to Games List</Link>
        </div>
      </div>
    );
  }

  const coverUrl = game.image_path
    ? `${window.API_URL}${game.image_path}`
    : defaultCover;

  return (
    <div className="Game">
      <Header />
      <div className='Middle'>
        <h1>{game.title}</h1>
        <div className='Game_content'>
          <img src={coverUrl} alt="Game Cover" onError={(e) => { e.target.src = defaultCover; }} />
          <div className='Game_info'>
            <p className="game-desc">{game.description || "No description provided for this transmission."}</p>
          </div>
          <div className='Game_info_text'>
            <p><strong>Developer:</strong> {game.developer || "Unknown Creator"}</p>
            <p><strong>Publisher:</strong> {game.publisher || "Planet.X Catalog"}</p>
            <p><strong>Release Date:</strong> {game.release_date ? new Date(game.release_date).toLocaleDateString() : "TBD"}</p>
            <p><strong>Platform:</strong> {game.platform || "PC"}</p>
            <p><strong>Genre:</strong> {getGenreName()}</p>
            <p><strong>Price:</strong> {game.price && parseFloat(game.price) > 0 ? `$${parseFloat(game.price).toFixed(2)}` : "Free"}</p>
            <div className='Game_buttons'>
              <button className='btn btn_download' onClick={handleDownload} style={{ width: '100%', padding: '15px', fontWeight: 'bold' }}>
                Download
              </button>
              {currentUser && (currentUser.role === 'admin' || currentUser.id === game.user_id) && (
                <button className='btn btn_delete' onClick={handleDelete} style={{ width: '100%', padding: '15px', fontWeight: 'bold', marginTop: '10px' }}>
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className='Game_comments'>
            <h4>Comments & Reviews:</h4>

            {isLoggedIn ? (
              <form className='Comment_box' onSubmit={handlePostComment}>
                <textarea
                  placeholder="Post your feedback about this game..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                ></textarea>
                {commentError && <div class Name="comment-error">{commentError}</div>}
                {commentSuccess && <div className="comment-success">{commentSuccess}</div>}
                <button type="submit" className="button btn" style={{ WebkitBorderRadius: "5px" }}>Post</button>
              </form>
            ) : (
              <p/*style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}*/>
                You must be <Link to="/Login" style={{ color: '#3b82f6' }}>Logged In</Link> to transmit feedback.
              </p>
            )}

            <div className='Game_comments_list'>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={comment.id || index} className="comment-card">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', textTransform: 'capitalize' }}>
                        {comment.author ? comment.author.charAt(0) : "?"}
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b', marginTop: '5px', whiteSpace: 'nowrap' }}>
                        {comment.author || "Anonym"}
                      </span>
                    </div>
                    <div className="comment_content">
                      <p className="comment_text">{comment.text}</p>
                      <span style={{ fontSize: '10px', color: '#475569', marginTop: '5px' }}>
                        {comment.created_at ? new Date(comment.created_at).toLocaleString() : ""}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b', fontSize: '14px' }}>No transmissions recorded. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;