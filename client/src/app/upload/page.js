"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

const VideoUpload = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        if (!title || !file) {
            setError("Please provide both title and file.");
            setIsSubmitting(false);
            return;
        }
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:1337/api/videos/", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setSuccess("Video uploaded successfully!");
            } else {
                setError("Failed to upload video.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar uploadButton={false} />
            <div className="container max-w-2xl p-8">
                <h1 className="text-3xl font-bold mb-6">Upload a Video</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <div className="flex flex-col">
                        <label
                            className="text-lg font-semibold"
                            htmlFor="title"
                        >
                            Video Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                            placeholder="Enter video title"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg font-semibold" htmlFor="file">
                            Upload Video File
                        </label>
                        <input
                            type="file"
                            id="file"
                            accept="video/*,.mkv"
                            onChange={(e) =>
                                setFile(e.target.files?.[0] || null)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`px-6 py-3 text-white font-semibold bg-blue-500 rounded-md ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Uploading..." : "Upload Video"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VideoUpload;
