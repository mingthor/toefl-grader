package com.appspot.toefl_avatar.languagelab;

import android.app.Activity;
import android.content.Context;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.util.Log;

import com.appspot.toefl_avatar.languagelab.data.ToeflAvatarDbHelper;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;


public class MediaController {
    private static final String LOG_TAG = "MediaManager";
    private static MediaRecorder mRecorder = null;
    private static MediaPlayer mPlayer = null;
    private static MediaController mInstance = null;
    private String mFileName = null;
    private static File mAppStorageDir = null;
    private ToeflAvatarDbHelper mDBHelper = null;
    private String mQuestionId;
    private long mStartTime;

    private MediaController(Activity activity) {
        mAppStorageDir = activity.getExternalFilesDir(null);
        mDBHelper = new ToeflAvatarDbHelper(activity);
    }

    public static MediaController getInstance(Activity activity) {
        if (mInstance == null)
            mInstance = new MediaController(activity);
        return mInstance;
    }

    public void startPlaying(String filename) {
        if (mPlayer == null) {
            mPlayer = new MediaPlayer();
            mPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mp) {
                    if (mPlayer != null && mPlayer.isPlaying()) {
                        stopPlaying();
                    }
                }
            });
            mPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    Log.d(LOG_TAG, "OnPreparedListener onPrepared()");
                    mPlayer.start();
                }
            });
        } else {
            mPlayer.reset();
        }
        try {
            File mediaFile = new File(mAppStorageDir.getAbsolutePath() + "/" + filename);
            if (!mediaFile.exists()) {
                Log.e(LOG_TAG, "media file does not exist " + mediaFile.getAbsolutePath());
            }
            mPlayer.setDataSource(mediaFile.getAbsolutePath());
            Log.d(LOG_TAG, mAppStorageDir.getAbsolutePath() + "/" + filename);
            mPlayer.prepareAsync();
        } catch (IOException e) {
            Log.e(LOG_TAG, "startPlaying() prepare() failed");
        }
    }

    public void stopPlaying() {
        mPlayer.stop();
        mPlayer.release();
        mPlayer = null;
    }


    public void startRecording(String questionId) {
        mQuestionId = questionId;
        mFileName = getUniqueFilename(mAppStorageDir.getAbsolutePath());
        try {
            mRecorder = new MediaRecorder();
            mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            mRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
            mRecorder.setOutputFile(mAppStorageDir + "/" + mFileName);
            mRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
            mRecorder.prepare();
        } catch (IOException e) {
            Log.e(LOG_TAG, "prepare() failed");
        } catch (Exception e) {
            Log.e(LOG_TAG, e.getMessage());
        }

        mRecorder.start();
        mStartTime = System.currentTimeMillis();
    }

    public void stopRecording() {
        mRecorder.stop();
        long duration = (System.currentTimeMillis() - mStartTime) / 1000;
        mRecorder.release();
        mRecorder = null;

        mDBHelper.insertRecordingItem(mQuestionId, mAppStorageDir.getAbsolutePath(), mFileName,
                DateFormat.getDateTimeInstance().format(new Date()),
                duration);
    }

    private String getUniqueFilename(String path) {
        File file = new File(path);
        if (!file.exists()) {
            boolean success = file.mkdir();
            if (!success) {
                Log.e(LOG_TAG, "getUniqueFilename failed because the path specified does not exist and cannot be created: " + path);
                return null;
            }
        }
        String format = "yyyy-MM-dd-HH-mm-ss";
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        return sdf.format(new Date()) + ".3gp";
    }
}
