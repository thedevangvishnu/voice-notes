import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./components/navbar";
import { Recorder } from "./components/recorder";

function App() {
  const recordedContainerRef = useRef<HTMLDivElement | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

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

  const handlePlayPause = useCallback(() => {
    if (recordedWs) {
      recordedWs.playPause();
    }
  }, [recordedWs]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Navbar />
      <div className="h-full bg-secondary w-full flex flex-col justify-center items-center">
        <Recorder />

        {/* <div className="w-1/2 px-4 py-2">
            <div className="">
              <h3 className="font-semibold text-lg">My recording</h3>
              <div>
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
          </div> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
