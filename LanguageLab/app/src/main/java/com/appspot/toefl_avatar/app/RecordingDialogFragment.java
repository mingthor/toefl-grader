package com.appspot.toefl_avatar.app;

import android.app.Activity;
import android.app.DialogFragment;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;


import java.util.Timer;
import java.util.TimerTask;


public class RecordingDialogFragment extends DialogFragment {

    private static final String LOG_TAG = "RecordingDialogFragment";
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "title";
    private static final String ARG_PARAM2 = "subtitle";
    private UserInteractionListener mInteractionListener;
    private TextView mRemainingTimeTextView;
    private Timer mTimer;
    private int mTimerCount = 10;
    TimerTask mTimerTask = new TimerTask() {

        @Override
        public void run() {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mTimerCount--;
                    if (mTimerCount >= 0) {
                        mRemainingTimeTextView.setText("Recording time: " +
                                Integer.toString(mTimerCount) + "s");
                    } else {
                        mTimer.cancel();
                        mTimer.purge();
                        dismiss();
                    }
                }
            });
        }
    };
    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public RecordingDialogFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment RecordingDialogFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static RecordingDialogFragment newInstance(String param1, String param2) {
        RecordingDialogFragment fragment = new RecordingDialogFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_recording_dialog, container);
        String title = getArguments().getString(ARG_PARAM1);
        String subtitle = getArguments().getString(ARG_PARAM2);
        getDialog().setTitle(title);
        getDialog().setCanceledOnTouchOutside(false);

        mRemainingTimeTextView = (TextView) view.findViewById(R.id.txtRecordingTime);
        mRemainingTimeTextView.setText(subtitle);

        (view.findViewById(R.id.btnStopRecording)).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        return view;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mTimer = new Timer();

        try {
            mInteractionListener = (UserInteractionListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString() + " must implement View.OnClickListener");
        }

        Log.d(LOG_TAG, "onAttach");
    }

    @Override
    public void onResume() {
        super.onResume();
        mTimer.scheduleAtFixedRate(mTimerTask, 0, 1000);
        Log.d(LOG_TAG, "onResume");
    }

    @Override
    public void onPause() {
        super.onPause();
        mTimer.cancel();
        mInteractionListener.onStopRecordingRequested();
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mTimer.purge();
        mInteractionListener = null;
        Log.d(LOG_TAG, "onDetach");
    }

    public interface UserInteractionListener {
        void onStopRecordingRequested();
    }
}
