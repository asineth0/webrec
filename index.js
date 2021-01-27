let rec;
let time;
let chunks;
let url;
let updateTimeInterval;
let video;
let streams;

const toggleStart = () => {
  document.querySelector("#start").classList.toggle("hidden");
};

const toggleStatus = () => {
  document.querySelector("#status").classList.toggle("hidden");
};

const togglePause = () => {
  document.querySelector("#pause").classList.toggle("hidden");
  document.querySelector("#resume").classList.toggle("hidden");
};

const toggleDone = () => {
  document.querySelector("#done").classList.toggle("hidden");
};

const updateTime = () => {
  time++;
  let m = Math.floor(time / 60);
  let s = time % 60;
  if (m < 10) m = `0${m}`;
  if (s < 10) s = `0${s}`;
  document.querySelector("#time").innerHTML = `Time: ${m}:${s}`;
};

const setupRecorder = (stream) => {
  toggleStart();
  toggleStatus();

  document.querySelector("#pause").classList.remove("hidden");
  document.querySelector("#resume").classList.add("hidden");

  time = 0;
  chunks = [];

  rec = new MediaRecorder(
    stream,
    video
      ? {
          mimeType: "video/webm; codecs=vp8,opus",
          videoBitsPerSecond: 2 * 1000 * 1000, //2mbps
          audioBitsPerSecond: 96 * 1000, //96kbps
        }
      : {
          mimeType: "audio/webm; codecs=opus",
          audioBitsPerSecond: 96 * 1000, //96kbps
        }
  );

  rec.addEventListener("dataavailable", ({ data }) => {
    chunks.push(data);
  });

  rec.addEventListener("stop", () => {
    toggleStatus();
    toggleDone();

    const blob = new Blob(chunks, {
      mimeType: video ? "video/webm; codecs=vp8,opus" : "audio/webm; codecs=opus",
    });

    url = URL.createObjectURL(blob);

    const el = document.createElement(video ? "video" : "audio");
    el.src = url;
    el.autoplay = false;
    el.controls = true;
    el.className = "outline-none";
    
    if (video) {
      el.autoplay = true;
      el.muted = true;
    }

    document.querySelector("#preview").appendChild(el);

    for (const stream of streams) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
    }
  });

  rec.start();

  updateTimeInterval = setInterval(updateTime, 1000);
};

document.querySelector("#dtop").addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1,
      sampleSize: 16,
      sampleRate: 48000,
    },
    video: {
      width: 1920,
      height: 1080,
      frameRate: 30,
    },
  });

  streams = [stream];

  video = true;
  setupRecorder(stream);
});

document.querySelector("#dtop-mic").addEventListener("click", async () => {
  const dtop = await navigator.mediaDevices.getDisplayMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1,
      sampleSize: 16,
      sampleRate: 48000,
    },
    video: {
      width: 1920,
      height: 1080,
      frameRate: 30,
    },
  });

  const mic = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
      sampleSize: 16,
      sampleRate: 48000,
    },
  });

  streams = [dtop, mic];

  const ctx = new AudioContext();
  const dest = ctx.createMediaStreamDestination();

  const micSrc = ctx.createMediaStreamSource(mic);
  micSrc.connect(dest);

  if (dtop.getAudioTracks().length > 0) {
    const dtopSrc = ctx.createMediaStreamSource(dtop);
    dtopSrc.connect(dest);
  }

  video = true;
  setupRecorder(new MediaStream([...dtop.getVideoTracks(), ...dest.stream.getAudioTracks()]));
});

document.querySelector("#camera").addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 1280,
      height: 720,
      frameRate: 30,
    },
  });

  streams = [stream];

  video = true;
  setupRecorder(stream);
});

document.querySelector("#camera-mic").addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
      sampleSize: 16,
      sampleRate: 48000,
    },
    video: {
      width: 1280,
      height: 720,
      frameRate: 30,
    },
  });

  streams = [stream];

  video = true;
  setupRecorder(stream);
});

document.querySelector("#mic").addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1,
      sampleSize: 16,
      sampleRate: 48000,
    },
  });

  streams = [stream];

  video = false;
  setupRecorder(stream);
});

document.querySelector("#stop").addEventListener("click", () => {
  rec.stop();
});

document.querySelector("#pause").addEventListener("click", () => {
  rec.pause();

  clearInterval(updateTimeInterval);
  togglePause();
});

document.querySelector("#resume").addEventListener("click", () => {
  rec.resume();

  setInterval(updateTime, 1000);
  togglePause();
});

document.querySelector("#save").addEventListener("click", () => {
  const el = document.createElement("a");
  el.href = url;
  el.download = `${new Date().toISOString()}.web`;
  el.click();
});

document.querySelector("#back").addEventListener("click", () => {
  toggleDone();
  toggleStart();

  const prev = document.querySelector("#preview");

  for (const child of prev.children) {
    prev.removeChild(child);
  }

  document.querySelector("#time").innerHTML = "Time 00:00";
});

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("serviceWorker.js");
}
