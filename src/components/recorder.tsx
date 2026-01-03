import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useWavesurfer } from "@wavesurfer/react";
import { Mic, Pause, Play, StopCircle } from "lucide-react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import { cn } from "@/lib/utils";

export function Recorder() {
  const recordingContainerRef = useRef<HTMLDivElement | null>(null);
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

  const { wavesurfer } = useWavesurfer({
    container: recordingContainerRef,
    waveColor: "#222",
    progressColor: "#444",
    cursorColor: "#888",
    height: 100,
    plugins,
  });

  useEffect(() => {
    if (!wavesurfer) {
      return;
    }
    const waveSurferPlugins = wavesurfer?.getActivePlugins();
    const recorder = waveSurferPlugins?.find(
      (plugin) => plugin instanceof RecordPlugin
    );
    if (!recorder) {
      return;
    }
    setRecorder(recorder);
  }, [wavesurfer]);

  useEffect(() => {
    if (!recorder) return;

    recorder.on("record-end", (blob: Blob) => {
      const recordedUrl = URL.createObjectURL(blob);
      setIsRecording(false);
      setIsRecordingPaused(false);
      setRecordedUrl(recordedUrl);
    });
  }, [recorder]);

  const handleRecorderClick = () => {
    if (!wavesurfer || !recorder) {
      return;
    }
    if (recorder.isPaused() || recorder.isRecording()) {
      setIsRecording(false);
      recorder.stopRecording();
    }

    recorder.startRecording();
    setIsRecording(true);
  };

  const handlePauseResumeRecording = () => {
    if (!wavesurfer || !recorder) return;

    if (isRecording && recorder.isRecording() && !recorder.isPaused()) {
      setIsRecordingPaused(true);
      recorder.pauseRecording();
      return;
    }

    if (isRecording && recorder.isActive() && recorder.isPaused()) {
      setIsRecordingPaused(false);
      recorder.resumeRecording();
    }
  };

  const handleStopRecording = () => {
    if (!wavesurfer || !recorder || !isRecording) return;

    if (recorder.isRecording() || recorder.isPaused()) {
      recorder.stopRecording();
    }
  };

  return (
    <div className="fixed left-1/2 bottom-6 -translate-x-[50%] flex flex-col items-center justify-center gap-2 bg-background p-4 rounded-xl shadow-lg">
      <div className="flex gap-2 w-[320px]">
        {!isRecording && (
          <Button
            onClick={() => {
              handleRecorderClick();
            }}
            className="w-full h-12 rounded-xl"
          >
            <Mic className="size-5" strokeWidth={1} />
            <span className="text-base">Record a note</span>
          </Button>
        )}

        <div className="w-full flex flex-col items-center gap-2">
          <div
            className={cn(
              "overflow-hidden border rounded-md w-full flex items-center justify-centre p-4",
              isRecording ? "opacity-100 h-[150px]" : "opacity-0 h-0"
            )}
          >
            <div ref={recordingContainerRef} className="w-full h-full"></div>
          </div>

          {isRecording && (
            <div className="rounded-md w-full flex items-center justify-between gap-2">
              <Button
                onClick={handlePauseResumeRecording}
                className="h-12 w-1/2 rounded-xl"
                variant="secondary"
              >
                {!isRecordingPaused ? (
                  <>
                    <Pause className="" strokeWidth={1} />
                    <span className="text-base">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="" strokeWidth={1} />
                    <span className="text-base">Resume</span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleStopRecording}
                className="w-1/2 h-12 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/15 hover:text-destructive hover:border hover:border-destructive/30"
              >
                <StopCircle className="" strokeWidth={1} />
                <span className="text-base">Stop and Save</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
