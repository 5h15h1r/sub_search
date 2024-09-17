"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch videos from the API
        const fetchVideos = async () => {
            const response = await fetch("http://localhost:1337/api/videos/");
            const data = await response.json();
            setVideos(data);
            console.log(data);
        };

        fetchVideos();
    }, []);

    const handleVideoClick = (id) => {
        // Navigate to the video detail page
        router.push(`/video/${id}`);
    };

    return (
        <div>
            <Navbar uploadButton={true} />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Video Gallery</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className="bg-white p-4 rounded shadow"
                        >
                            <Link legacyBehavior href={`/videos/${video.id}`}>
                                <a>
                                    <img
                                        src={`http://localhost:1337${video.thumbnail}`}
                                        alt={`${video.title} thumbnail`}
                                        className="w-full h-auto mb-4"
                                    />
                                    <h2 className="text-lg font-bold">
                                        {video.title}
                                    </h2>
                                </a>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoList;
