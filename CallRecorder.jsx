import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import CallKeep from 'react-native-callkeep';
import InCallManager from 'react-native-incall-manager';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { request, PERMISSIONS } from 'react-native-permissions';


const audioRecorderPlayer = new AudioRecorderPlayer();
// const recordingsDir = RNFS.ExternalStorageDirectoryPath + '/CallRecordings/';

const CallRecorder = () => {
    const [recordings, setRecordings] = useState([]);

    useEffect(() => {
        setupCallDetection();
        requestPermissions();
        loadRecordings(); // Load recordings when component mounts
    }, []);

    // Request necessary permissions
    const requestPermissions = async () => {
        await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        await request(PERMISSIONS.ANDROID.READ_PHONE_STATE);
    };

    // Setup call detection
    const setupCallDetection = () => {
        CallKeep.setup({
            ios: { appName: 'Call Recorder' },
            android: {
                alertTitle: 'Allow Call Access',
                alertDescription: 'This app needs access to detect calls.',
                cancelButton: 'Cancel',
                okButton: 'OK',
                foregroundService: { channelId: 'call-recording', channelName: 'Call Recording' },
            },
        });

        CallKeep.addEventListener('didReceiveStartCallAction', handleIncomingCall);
    };

    // Handle incoming call
    const handleIncomingCall = async () => {
        Alert.alert(
            'Enable Speaker',
            'Turn on the speaker for better recording quality.',
            [
                { text: 'Cancel' },
                { text: 'OK', onPress: startCallRecording }
            ]
        );
    };

    // Start call recording
    const startCallRecording = async () => {
        InCallManager.setSpeakerphoneOn(true); // Enable speaker
        // const path = recordingsDir + `call_${Date.now()}.mp3`;

        // try {
        //     // Ensure directory exists, create if not
        //     // const exists = await RNFS.exists(recordingsDir);
        //     if (!exists) {
        //         await RNFS.mkdir(recordingsDir); // Create folder if not exists
        //     }

        //     await audioRecorderPlayer.startRecorder(path, { format: 'mp3' });
        //     console.log('Recording started at:', path);
        // } catch (error) {
        //     console.error('Error starting recording:', error);
        // }
    };

    // Stop call recording
    const stopCallRecording = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        console.log('Recording saved:', result);
        loadRecordings(); // Refresh recordings list
    };

    // Load saved recordings
    const loadRecordings = async () => {
        // try {
        // Ensure the directory exists before reading
        //     const exists = await RNFS.exists(recordingsDir);
        //     if (!exists) {
        //         await RNFS.mkdir(recordingsDir); // Create folder if not exists
        //     }

        //     // Read directory and set recordings state
        //     const files = await RNFS.readDir(recordingsDir);
        //     setRecordings(files);
        // } catch (error) {
        //     console.error('Error loading recordings:', error);
        // }
    };

    // Play selected recording
    const playRecording = async (path) => {
        await audioRecorderPlayer.startPlayer(path);
        console.log('Playing:', path);
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Call Recorder</Text>

            <Button title="Stop Recording" onPress={stopCallRecording} color="red" />

            <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'bold' }}>Saved Recordings</Text>
            <FlatList
                data={recordings}
                keyExtractor={(item) => item.path}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => playRecording(item.path)}>
                        <Text style={{ padding: 10, borderBottomWidth: 1 }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default CallRecorder;
