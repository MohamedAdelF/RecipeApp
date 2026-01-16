import os
import re
from fastapi import FastAPI
import requests
from youtube_transcript_api import YouTubeTranscriptApi
from yt_dlp import YoutubeDL

app = FastAPI()

def _clean_vtt_text(vtt_text: str) -> str:
    lines = []
    for line in vtt_text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.upper() == "WEBVTT":
            continue
        if "-->" in stripped:
            continue
        if re.match(r"^\d+$", stripped):
            continue
        if stripped.lower().startswith("kind:"):
            continue
        if stripped.lower().startswith("language:"):
            continue
        stripped = re.sub(r"<[^>]+>", " ", stripped)
        lines.append(stripped)
    return " ".join(lines).replace("  ", " ").strip()


def _fetch_via_ytdlp(video_id: str, lang: str, cookies_path: str | None, cookies_browser: str | None):
    ydl_opts = {
        "skip_download": True,
        "quiet": True,
        "no_warnings": True,
        "cookiefile": cookies_path or None,
        "extractor_args": {"youtube": {"player_client": ["android"]}},
    }
    if cookies_browser and not cookies_path:
        ydl_opts["cookiesfrombrowser"] = (cookies_browser,)

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)

    captions = info.get("subtitles") or {}
    auto_captions = info.get("automatic_captions") or {}

    def pick_caption_url(store):
        entries = store.get(lang) or []
        for entry in entries:
            if entry.get("ext") == "vtt" and entry.get("url"):
                return entry["url"]
        for entry in entries:
            if entry.get("url"):
                return entry["url"]
        return None

    caption_url = pick_caption_url(captions) or pick_caption_url(auto_captions)
    if not caption_url:
        raise RuntimeError("No captions found for requested language")

    response = requests.get(caption_url, timeout=30)
    response.raise_for_status()
    return _clean_vtt_text(response.text)


@app.get("/api/transcript")
def transcript(videoId: str, lang: str = "en"):
    try:
        cookies_path = os.getenv("TRANSCRIPT_COOKIES_PATH")
        cookies_browser = os.getenv("TRANSCRIPT_COOKIES_BROWSER")
        transcript_items = YouTubeTranscriptApi.get_transcript(
            videoId,
            languages=[lang],
            cookies=cookies_path,
        )
        text = " ".join([item.get("text", "") for item in transcript_items]).strip()
        if not text:
            raise RuntimeError("Empty transcript from primary API")
        return {"success": True, "videoId": videoId, "transcript": text}
    except Exception as exc:
        try:
            text = _fetch_via_ytdlp(videoId, lang, cookies_path, cookies_browser)
            return {"success": True, "videoId": videoId, "transcript": text}
        except Exception as fallback_exc:
            return {
                "success": False,
                "videoId": videoId,
                "error": f"{exc} | fallback: {fallback_exc}",
                "transcript": None,
            }
