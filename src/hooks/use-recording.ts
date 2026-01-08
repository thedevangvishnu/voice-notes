import { useState } from "react";

type Recording = {
  id: string;
  name: string;
  url: string;
};

export const useRecording = () => {
  const [recordings, setRecordings] = useState<Recording[] | null>(null);

  const saveRecording = (recordingId: string) => {
    // save recording, update local variable and update local storage also
  };

  const updateRecording = (recordingId: string, data: Partial<Recording>) => {
    // update recording in local var and update local storage data
  };

  const deleteRecording = (recordingId: string) => {
    // remove recording from local var and update local storage
  };
};
