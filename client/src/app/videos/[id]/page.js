"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/app/components/Navbar";

const VideoDetail = ({ params }) => {
    const [video, setVideo] = useState(null);
    const [subtitleTracks, setSubtitleTracks] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [videoDuration, setVideoDuration] = useState(0);
    const [processed, setProcessed] = useState(false);
    const videoRef = useRef(null);
    const { id } = params;

    useEffect(() => {
        const videoId = id;

        const fetchSubtitles = async () => {
            try {
                const languagesURL = `http://localhost:1337/api/subtitles/${videoId}`;
                const response = await fetch(languagesURL);
                const data = await response.json();

                const languages = data.languages.map((lang) => lang.language);

                // Fetch subtitle tracks for all languages
                const tracks = await Promise.all(
                    languages.map(async (language) => {
                        const subtitleURL = `http://localhost:1337/api/subtitles/${videoId}/${language}/`;
                        const subtitleResponse = await fetch(subtitleURL);
                        const subtitleData = await subtitleResponse.json();

                        const vttData = subtitleData.content;
                        const blob = new Blob([vttData], { type: "text/vtt" });
                        const trackUrl = URL.createObjectURL(blob);
                        console.log(trackUrl);
                        return {
                            language,
                            url: trackUrl,
                        };
                    })
                );

                setSubtitleTracks(tracks);
                console.log("Fetched ");
            } catch (error) {
                console.error("Error fetching subtitles:", error);
            }
        };

        fetchSubtitles();
    }, [id]);

    useEffect(() => {
        const fetchVideo = async () => {
            const response = await fetch(
                `http://localhost:1337/api/videos/${id}/`
            );
            const data = await response.json();
            setProcessed(data.processed);
            setVideo(data);
        };

        fetchVideo();
    }, [id]);

    const handleSearch = async () => {
        try {
            const searchURL = `http://localhost:1337/api/videos/${id}/search/?q=${encodeURIComponent(
                searchQuery
            )}`;
            const response = await fetch(searchURL);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setVideoDuration(videoRef.current.duration);
        }
    };

    const handleTimestampClick = (startTime) => {
        if (videoRef.current) {
            videoRef.current.currentTime = startTime;
            videoRef.current.play();
        }
    };

    if (!video) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Navbar uploadButton={true} />
            <div className="container p-8">
                <h1 className="text-3xl font-bold mb-6">{video.title}</h1>
                {processed ? (
                    <div className="hidden"></div>
                ) : (
                    <div>The subtitles are being processed</div>
                )}
                <div className="flex justify-start w-full space-x-20">
                    <video
                        ref={videoRef}
                        width="854"
                        height="480"
                        controls
                        onLoadedMetadata={handleLoadedMetadata}
                    >
                        <source
                            src={`http://localhost:1337${video.file}`}
                            type="video/mp4"
                        />
                        {subtitleTracks.map((track, index) => (
                            <track
                                key={index}
                                src={track.url}
                                kind="subtitles"
                                srcLang={track.language}
                                label={track.language.toUpperCase()}
                            />
                        ))}
                    </video>
                    <div className="w-[30%] p-4 bg-white shadow-lg rounded-lg border border-gray-200 space-y-6">
  <h2 className="text-xl font-semibold text-gray-800">
    Search Captions
  </h2>
  
  <label
    htmlFor="default-search"
    className="mb-2 text-sm font-medium text-gray-700 sr-only"
  >
    Search
  </label>

  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg
        className="w-5 h-5 text-gray-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>
    <input
      type="search"
      id="default-search"
      value={searchQuery}
      onChange={handleSearchChange}
      className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
      placeholder="Search captions..."
      required
    />
    <button
      type="submit"
      onClick={handleSearch}
      className="absolute right-2.5 bottom-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-4 focus:ring-indigo-300"
    >
      Search
    </button>
  </div>

  {/* Search Results */}
  <ul className="space-y-4">
    {searchResults.length > 0 ? (
      searchResults.map((result, index) => (
        <li
          key={index}
          onClick={() => handleTimestampClick(result.start_time)}
          className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
        >
          <p className="text-sm text-gray-700">{result.text}</p>
          <div className="mt-1">
            Jump to{" "}
            <span className="text-indigo-600 underline">
              {result.start_time}s
            </span>
          </div>
        </li>
      ))
    ) : (
      <li className="text-sm text-gray-500">
        No results found.
      </li>
    )}
  </ul>
</div>
                </div>
            </div>
        </div>
    );
};

export default VideoDetail;
