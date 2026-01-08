# Youtube Video Downloader
This is a chrome browser extension. It functions as a Youtube Video Downloader. Inserting a download button on the page of a Youtube video so that the user can download the videos locally. No Ads for now.


## Run Python Server
```bash
pip install uvicorn pytubefix fastapi

# Dev
python -m uvicorn main:app --reload

# Prod
uvicorn src.main:app --host 127.0.0.1 --port $PORT
uvicorn main:app --host 127.0.0.1 --port $PORT
gunicorn src.main:app --host 127.0.0.1 --port $PORT
```


## To Download Video
```bash
# Uncomment the download function
http://localhost:8000/download/<youtube_video_id>
```

## To List the Streams
```bash
http://localhost:8000/streams/<youtube_video_id>
```