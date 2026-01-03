import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { useWavesurfer } from "@wavesurfer/react";
import { Mic, Pause, Play, StopCircle } from "lucide-react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";

function App() {
  const recordingContainerRef = useRef<HTMLDivElement | null>(null);
  const recordedContainerRef = useRef<HTMLDivElement | null>(null);
  const [recorder, setRecorder] = useState<RecordPlugin | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);

  const plugins = useMemo(() => {
    return [
      RecordPlugin.create({
        renderRecordedAudio: false,
        continuousWaveform: true,
        continuousWaveformDuration: 30,
      }),
      TimelinePlugin.create(),
    ];
  }, []);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: recordingContainerRef,
    waveColor: "#222",
    progressColor: "#444",
    cursorColor: "#888",
    height: 200,
    plugins,
  });

  const { wavesurfer: recordedWs, isPlaying: isPlayingRecorded } =
    useWavesurfer({
      container: recordedContainerRef,
      waveColor: "#555",
      progressColor: "#777",
      cursorColor: "#888",
      url: recordedUrl || "",
      height: 200,
      plugins: useMemo(() => [TimelinePlugin.create()], []),
    });

  useEffect(() => {
    if (!wavesurfer) return;
    const waveSurferPlugins = wavesurfer?.getActivePlugins();
    const recorder = waveSurferPlugins?.find(
      (plugin) => plugin instanceof RecordPlugin
    );
    if (!recorder) return;
    setRecorder(recorder);
  }, [wavesurfer]);

  useEffect(() => {
    if (!recorder) return;

    recorder.on("record-end", (blob: Blob) => {
      console.log("Record-end fired up");
      const recordedUrl = URL.createObjectURL(blob);
      setIsRecording(false);
      setIsRecordingPaused(false);
      setRecordedUrl(recordedUrl);
    });
  }, [recorder]);

  const handlePlayPause = useCallback(() => {
    if (recordedWs) {
      recordedWs.playPause();
    }
  }, [recordedWs]);

  const handleRecorderClick = () => {
    if (!wavesurfer || !recorder) return;
    if (recorder.isPaused() || recorder.isRecording()) {
      setIsRecording(false);
      recorder.stopRecording();
    }

    recorder.startRecording();
    setIsRecording(true);
    console.log("Recording started");
  };

  const handlePauseResumeRecording = () => {
    if (!wavesurfer || !recorder) return;

    if (isRecording && recorder.isRecording() && !recorder.isPaused()) {
      console.log("Pausing recorder....");
      setIsRecordingPaused(true);
      recorder.pauseRecording();
      return;
    }

    if (isRecording && recorder.isActive() && recorder.isPaused()) {
      console.log("Resuming recorder....");
      setIsRecordingPaused(false);
      recorder.resumeRecording();
    }
  };

  const handleStopRecording = () => {
    if (!wavesurfer || !recorder || !isRecording) return;

    if (recorder.isRecording() || recorder.isPaused()) {
      console.log("Stopping recording....");
      recorder.stopRecording();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <div className="py-4 border-b w-full flex items-center justify-start px-4">
        <h1 className="text-2xl font-semibold">Voice recorder</h1>
      </div>

      <div className="h-full flex w-full">
        {/* Left section: Recorder */}
        <div className="flex flex-col w-1/2 h-full items-center justify-center gap-2 bg-secondary px-4">
          {/* Recording section */}
          <div
            ref={recordingContainerRef}
            className="border rounded-md h-[300px] w-full"
          ></div>

          <div className="flex gap-2">
            {!isRecording && (
              <Button
                className="h-20 w-20 rounded-full p-0"
                onClick={handleRecorderClick}
              >
                <Mic className="size-10" strokeWidth={1} />
              </Button>
            )}
            {isRecording && (
              <>
                {/* Pause recording */}
                <Button
                  className="h-20 w-20 rounded-full p-0"
                  onClick={handlePauseResumeRecording}
                >
                  {!isRecordingPaused ? (
                    <Pause className="size-10" strokeWidth={1} />
                  ) : (
                    <Play className="size-10" strokeWidth={1} />
                  )}
                </Button>
                {/* Stop recording */}
                <Button
                  className="h-20 w-20 rounded-full p-0"
                  onClick={handleStopRecording}
                >
                  <StopCircle className="size-10" strokeWidth={1} />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Right section: All recordings */}
        <div className="w-1/2 px-4 py-2">
          <div className="">
            <h3 className="font-semibold text-lg">My recording</h3>
            <div>
              {/* Recording section */}
              {recordedUrl && (
                <div className="flex flex-col">
                  <div
                    ref={recordedContainerRef}
                    className="border rounded-md h-[300px] w-full"
                  ></div>
                  <Button
                    className="h-10 w-10 rounded-full p-0"
                    onClick={handlePlayPause}
                  >
                    {isPlayingRecorded ? (
                      <Pause className="size-6" strokeWidth={1} />
                    ) : (
                      <Play className="size-6" strokeWidth={1} />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
