import {Symbl} from '@symblai/symbl-web-sdk';

import React, {
    useState,
    useRef,
    useCallback,
    useEffect,
    useContext,
  } from 'react';
  import { useParams } from 'next/navigation';
  import { getToken } from '../api/fetchCreds';
  import { PreferencesContext } from '@/app/(root)/context/PreferencesContext';
export const useSymbalai = ( { previewPublisher,
    cameraPublishing,room}) => {
    let streamRef = useRef(null);
 const { preferences } = useContext(PreferencesContext);
 const [captions, setCaptions] = useState('');
 const [myCaptions, setMyCaptions] = useState('');
 const [name, setName] = useState(null);
 const [symblToken, setSymblToken] = useState(null);
 const[symbl,setSymbl]=useState(null);
 let { roomName } = useParams();
 useEffect(() => {
    getToken ()
      .then((response) => {
        console.log("TOken",response.data.accessToken);
        setSymblToken(response.data.accesToken);
      setSymbl(  new Symbl({
        accessToken: response.data.accessToken 
        //   basePath: 'https://api.symbl.ai',
        }));
      })
      .catch((e) => console.log(e));
  }, []);
  useEffect(() => {
    if (cameraPublishing) {
        // console.log("pub",previewPublisher)
    //   const audioTrack = previewPublisher.getAudioSource();
    
      const getAudioSource = async () => {
        if (room && room.camera) {
          const audioDevice = await room.camera.getAudioDevice();
          return audioDevice.deviceId;
        }
      };
      const audioDeviceId =  room.camera.getAudioDevice();
      const stream = new MediaStream();
      stream.addTrack(audioDeviceId);
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const id = roomName;

      const connectionConfig = {
        id,
        insightTypes: ['action_item', 'question'],
        sourceNode: source,
        reconnectOnError: true,
        config: {
          meetingTitle: 'My Test Meeting ' + id,
          confidenceThreshold: 0.5, // Offset in minutes from UTC
          encoding: 'LINEAR16',
          languageCode: 'en-US',
          sampleRateHertz: 48000,
        },
        speaker: {
          // Optional, if not specified, will simply not send an email in the end.
          userId: '', // Update with valid email
          name: preferences.userName || uuidv4(),
        },
        handlers: {
          /**
           * This will return live speech-to-text transcription of the call.
           */
          onSpeechDetected: (data) => {
            // console.log(data);
            if (data) {
              if (data.user.name !== preferences.userName) {
                setCaptions(data.punctuated.transcript);
                setName(data.user.name);
              } else {
                setMyCaptions(data.punctuated.transcript);
              }
            }
          },
          /**
           * When processed messages are available, this callback will be called.
           */
          onMessageResponse: (data) => {
            getSentiment();
          },

          onTopicResponse: (data) => {
            console.log(data);
          },
          // /**
          //  * When Symbl detects an insight, this callback will be called.
          //  */
          onInsightResponse: (data) => {
            for (let insight of data) {
              addInsight(insight);
            }
          },
        },
      };

      const start = async () => {
        try {
          console.log("rrgd",symbl);
          const stream = await symbl.createStream(connectionConfig);
          streamRef.current = stream;
          console.log(stream);
          await stream.start();
          conversationId.current = await stream.conversationId;
          console.log(conversationId.current);
          preferences.conversationId = conversationId.current;
        } catch (e) {
          console.log(e);
        }
      };
      start();
    }
  }, [
    cameraPublishing,
    // addInsight,
    // getSentiment,
    preferences,
    previewPublisher,
    roomName,
  ]);
  
  return {
    captions,
    myCaptions,
    name,
  };
}

