import React, { useEffect, useState } from "react";
import { fetchFromAPI } from "./api";
import "./VideoList.css";

const VideoItem = ({ video, onPlay, isPlaying, onError }) => {
  return (
    <li className="video-item">
      <h3>{video.snippet.title}</h3>
      <p>{video.snippet.description}</p>
      {isPlaying ? (
        <div className="player-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=1`}
            className="iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Video Player"
            onError={onError}
          />
          <button onClick={onPlay} className="close-button">
            &times;
          </button>
        </div>
      ) : (
        <img
          src={video.snippet.thumbnails.default.url}
          alt={video.snippet.title}
          className="thumbnail"
          onClick={onPlay}
        />
      )}
    </li>
  );
};

const VideoList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [playbackError, setPlaybackError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchFromAPI(
          "search?part=snippet&chart=mostPopular&maxResults=50&regionCode=US"
        );
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlayingVideoId(null);
    setPlaybackError(null);

    try {
      const result = await fetchFromAPI(
        `search?part=snippet&q=${encodeURIComponent(searchTerm)}&maxResults=50`
      );
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayClick = (videoId) => {
    setPlayingVideoId(videoId === playingVideoId ? null : videoId);
    setPlaybackError(null);
  };

  const handlePlaybackError = () => {
    setPlaybackError("This video cannot be played.");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for videos..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {playbackError && (
        <div className="error">
          {playbackError}
          <button
            onClick={() => setPlaybackError(null)}
            className="close-button"
          >
            &times;
          </button>
        </div>
      )}
      <ul className="video-list">
        {data && data.items ? (
          data.items.map((item) => (
            <VideoItem
              key={item.id.videoId}
              video={item}
              onPlay={() => handlePlayClick(item.id.videoId)}
              isPlaying={playingVideoId === item.id.videoId}
              onError={handlePlaybackError}
            />
          ))
        ) : (
          <div>No data available</div>
        )}
      </ul>
    </div>
  );
};

export default VideoList;
