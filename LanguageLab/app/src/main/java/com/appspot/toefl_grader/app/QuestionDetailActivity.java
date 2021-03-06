package com.appspot.toefl_grader.app;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.NavUtils;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;

import com.appspot.toefl_grader.app.data.DataContract;
import com.appspot.toefl_grader.app.data.QuestionDataSource;


/**
 * An activity representing a single Question detail screen. This
 * activity is only used on handset devices. On tablet-size devices,
 * item details are presented side-by-side with a list of items
 * <p/>
 * This activity is mostly just a 'shell' activity containing nothing
 * more than a {@link QuestionDetailFragment}.
 */
public class QuestionDetailActivity extends AppCompatActivity
        implements View.OnClickListener, RecordingDialogFragment.UserInteractionListener {

    private static final String LOG_TAG = "QuestionDetailActivity";
    private QuestionDetailFragment mDetailFragment = null;
    private RecordingDialogFragment mDialogFragment = null;
    private DataContract.QuestionItem mItem = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_question_detail);

        // Show the Up button in the action bar.
        //getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        // savedInstanceState is non-null when there is fragment state
        // saved from previous configurations of this activity
        // (e.g. when rotating the screen from portrait to landscape).
        // In this case, the fragment will automatically be re-added
        // to its container so we don't need to manually add it.
        // For more information, see the Fragments API guide at:
        //
        // http://developer.android.com/guide/components/fragments.html
        //
        if (savedInstanceState == null) {

            mItem = QuestionDataSource.ITEM_MAP.get(getIntent().getStringExtra(QuestionDetailFragment.ARG_ITEM_ID));

            // Create the detail fragment and add it to the activity
            // using a fragment transaction.
            Bundle arguments = new Bundle();
            arguments.putString(QuestionDetailFragment.ARG_ITEM_ID,
                    getIntent().getStringExtra(QuestionDetailFragment.ARG_ITEM_ID));
            mDetailFragment = new QuestionDetailFragment();
            mDetailFragment.setArguments(arguments);
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.question_detail_container, mDetailFragment)
                    .commit();
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == android.R.id.home) {
            // This ID represents the Home or Up button. In the case of this
            // activity, the Up button is shown. Use NavUtils to allow users
            // to navigate up one level in the application structure. For
            // more details, see the Navigation pattern on Android Design:
            //
            // http://developer.android.com/design/patterns/navigation.html#up-vs-back
            //
            NavUtils.navigateUpTo(this, new Intent(this, MainActivity.class));
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public void showRecordingDialog() {
        mDialogFragment = RecordingDialogFragment.newInstance("Recording in progress", "Recording time: 10s");
        mDialogFragment.show(getFragmentManager(), "Recording");
    }

    @Override
    public void onPause() {
        super.onPause();

    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btnStartRecording) {
            MediaController.getInstance(this).startRecording(mItem.id);
            showRecordingDialog();
        }
    }

    @Override
    public void onStopRecordingRequested() {
        MediaController.getInstance(this).stopRecording();
        mDetailFragment.reload();
    }
}
