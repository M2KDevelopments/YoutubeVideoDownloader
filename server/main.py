import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pytubefix import YouTube

def on_progress(stream, chunk, bytes_remaining):
        total = stream.filesize
        percent = (1 - bytes_remaining / total) * 100
        print(f"\rProgress: {percent:.2f}%", end="")

def on_complete(stream, file_path):
    print(f"\n√ Done downloading: {file_path}")
        
app = FastAPI()


@app.get("/")
def download_video():
    return "Health Check"

# @app.get("/download/{youtube_video_id}")
# def download_video(youtube_video_id: str):
#     try:
#         yt = YouTube(f"http://youtube.com?watch?v={youtube_video_id}", on_progress_callback=on_progress, on_complete_callback=on_complete)
#         stream = yt.streams.get_highest_resolution()
#         out_file = stream.download(output_path="media", filename=f"{youtube_video_id}.mp4") 
#         return FileResponse(
#             path=out_file, 
#             filename=os.path.basename(out_file),
#             media_type='video/mp4'
#         )
#     except Exception as e:
#             print(e)
#             raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

@app.get("/streams/{youtube_video_id}")
def get_streams(youtube_video_id: str):
    try:
        yt = YouTube(f"http://youtube.com?watch?v={youtube_video_id}", on_progress_callback=on_progress, on_complete_callback=on_complete)
        yt.register_on_progress_callback(on_progress)
        yt.register_on_complete_callback(on_complete)
        available_streams = yt.streams.filter(progressive=True)
        streams = []
        for s in available_streams:
            streams.append({
                "itag": s.itag,
                "mime_type": s.mime_type,
                "resolution": s.resolution,
                "fps": s.fps,
                "video_codec": s.video_codec,
                "audio_codec": s.audio_codec,
                "filesize": s.filesize,
                "url": s.url
            })
        return {"streams": streams, "result":True}
    except Exception as e:
        # raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
        return {"streams": [], "result":False, "message":str(e)}