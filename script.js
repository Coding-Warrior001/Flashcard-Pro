document.getElementById('downloadBtn').addEventListener('click', function() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const message = document.getElementById('message');
  const preview = document.getElementById('videoPreview');

  if (!url) {
    message.textContent = "Please enter a TikTok URL.";
    return;
  }

  message.textContent = "Fetching video...";

  fetch(`https://tiktok-video-downloader-api-no-watermark.p.rapidapi.com/video?url=${encodeURIComponent(url)}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
      'X-RapidAPI-Host': 'tiktok-video-downloader-api-no-watermark.p.rapidapi.com'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'ok' && data.video_url) {
      message.textContent = "Video ready to download!";
      preview.innerHTML = `
        <video width="300" controls>
          <source src="${data.video_url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <br>
        <a href="${data.video_url}" download="tiktok_video.mp4">
          <button>Download Video</button>
        </a>
      `;
    } else {
      message.textContent = "Failed to fetch video. Please check the URL.";
    }
  })
  .catch(error => {
    message.textContent = "Error fetching video.";
    console.error(error);
  });
});