import os
import subprocess
from celery import shared_task
from django.conf import settings
from .models import Video, Subtitle, SubtitleLine


@shared_task(name="videoparser.tasks.process_video")
def process_video(video_id):
    video = Video.objects.get(id=video_id)
    video_path = os.path.join(settings.MEDIA_ROOT, str(video.file))

    # # Use ffmpeg to list all subtitles in the video
    subtitle_streams = get_subtitle_languages(video_path)

    for stream_index, language in subtitle_streams.items():
        subtitle_dir = os.path.join(settings.MEDIA_ROOT, "subtitles")
        os.makedirs(subtitle_dir, exist_ok=True)

        subtitle_filename = (
            os.path.splitext(os.path.basename(video_path))[0] + f"_{language}.vtt"
        )
        thumbnail_dir = os.path.join(settings.MEDIA_ROOT, "thumbnails")
        os.makedirs(thumbnail_dir, exist_ok=True)

        # Thumbnail file name and path
        thumbnail_filename = os.path.splitext(os.path.basename(video_path))[0] + ".jpeg"
        thumbnail_path = os.path.join(thumbnail_dir, thumbnail_filename)

        # Use ffmpeg to generate a thumbnail from the video
        try:
            subprocess.run(
                [
                    "ffmpeg",
                    "-i",
                    video_path,
                    "-vf",
                    "select=eq(n\\,100)",  # Select the 100th frame
                    "-q:v",
                    "2", 
                    "-frames:v",
                    "1",
                    "-y",
                    thumbnail_path,
                ],
                check=True,
            )
        except subprocess.CalledProcessError as e:
            print(f"An error occurred: {e}")
            return {}

        # Save the thumbnail path to the video object
        video.thumbnail = f"thumbnails/{thumbnail_filename}"
        subtitle_path = os.path.join(subtitle_dir, subtitle_filename)

        try:
            subprocess.run(
                [
                    "ffmpeg",
                    "-i",
                    video_path,
                    "-map",
                    f"0:{stream_index}",
                    "-c:s",
                    "webvtt",
                    subtitle_path,
                ]
            )
        except subprocess.CalledProcessError as e:
            print(f"An error occurred: {e}")
            return {}

        with open(subtitle_path, "r") as srt_file:
            subtitle_content = srt_file.read()

        subtitle = Subtitle.objects.create(
            video=video, language=language, content=subtitle_content
        )
        parse_vtt_content(subtitle, subtitle_content)

    video.processed = True
    video.save()
    return {
        "status": "success",
        "subtitles_extracted": len(subtitle_streams),
    }


def get_subtitle_languages(video_file):
    command = [
        "ffprobe",
        "-v",
        "error",
        "-select_streams",
        "s",
        "-show_entries",
        "stream=index:stream_tags=language",
        "-of",
        "csv=p=0",
        video_file,
    ]

    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        lines = result.stdout.strip().split("\n")
        subtitles = {}
        for line in lines:
            if line:
                parts = line.split(",")
                if len(parts) == 2:
                    index, lang = parts
                else:
                    index = parts[0]
                    lang = "und"
                subtitles[int(index)] = lang

        return subtitles

    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
        return {}


def parse_vtt_content(subtitle, content):
    # Strip the content and remove any WEBVTT header
    content = content.strip().replace("WEBVTT", "").strip()

    # Split content into blocks using double newlines (separates subtitle blocks)
    blocks = content.split("\n\n")

    for block in blocks:
        lines = block.split("\n")

        if len(lines) >= 2:
            # Extract the time range
            time_range = lines[0].split(" --> ")
            start_time = time_to_seconds_vtt(time_range[0])
            end_time = time_to_seconds_vtt(time_range[1])

            text = " ".join(lines[1:])

            # Create subtitle line in the database
            SubtitleLine.objects.create(
                subtitle=subtitle, start_time=start_time, end_time=end_time, text=text
            )


def time_to_seconds_vtt(time_str):
    """
    Parse time in VTT format: MM:SS.mmm or HH:MM:SS.mmm.
    Handles both hour-minute-second and minute-second cases.
    """
    time_parts = time_str.split(":")

    # If there are three parts (HH:MM:SS.mmm), handle hours
    if len(time_parts) == 3:
        h, m, s = time_parts
        return int(h) * 3600 + int(m) * 60 + float(s.replace(",", "."))

    # If there are two parts (MM:SS.mmm), handle minutes and seconds
    elif len(time_parts) == 2:
        m, s = time_parts
        return int(m) * 60 + float(s.replace(",", "."))
