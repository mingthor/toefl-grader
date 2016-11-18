package com.appspot.toefl_grader.app;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.TextView;

import com.appspot.toefl_grader.app.data.ToeflAvatarDbHelper;
import com.appspot.toefl_grader.app.data.DataContract;
import com.appspot.toefl_grader.app.data.QuestionDataSource;

/**
 * A fragment representing a single Question detail screen.
 */
public class QuestionDetailFragment extends Fragment {
    /**
     * The fragment argument representing the item ID that this fragment
     * represents.
     */
    public static final String ARG_ITEM_ID = "item_id";
    private static final String LOG_TAG = "QuestionDetailFragment";

    private DataContract.QuestionItem mItem = null;
    private ListView mRecordsListView = null;
    private ToeflAvatarDbHelper mDBHelper = null;
    private SimpleCursorAdapter mRecordCursorAdapter = null;
    private View.OnClickListener mOnRecordClickCallback;

    /**
     * Mandatory empty constructor for the fragment manager to instantiate the
     * fragment (e.g. upon screen orientation changes).
     */
    public QuestionDetailFragment() {
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // TODO:
        // to be able to recover the fragment content when press back button
        if (getArguments().containsKey(ARG_ITEM_ID)) {
            // Load the dummy content specified by the fragment
            // arguments. In a real-world scenario, use a Loader
            // to load content from a content provider.
            mItem = QuestionDataSource.ITEM_MAP.get(getArguments().getString(ARG_ITEM_ID));
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_question_detail, container, false);

        if (mItem == null)
            Log.e(LOG_TAG, "onCreateView mItem is null");

        // Show the dummy content as text in a TextView.
        if (mItem != null) {
            ((TextView) rootView.findViewById(R.id.question_subject_english)).setText(mItem.titleEnglish);
            ((TextView) rootView.findViewById(R.id.question_subject_chinese)).setText(mItem.titleChinese);
            ((TextView) rootView.findViewById(R.id.question_detail_content)).setText(mItem.content);
            (rootView.findViewById(R.id.btnStartRecording)).setOnClickListener(mOnRecordClickCallback);
            mRecordsListView = (ListView) rootView.findViewById(R.id.listViewRecords);
            populateRecordingsList(rootView.getContext());
            registerForContextMenu(mRecordsListView);
        }

        return rootView;
    }


    @Override
    public void onAttach(Context activity) {
        super.onAttach(activity);
        try {
            mOnRecordClickCallback = (View.OnClickListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString() + " must implement View.OnClickListener");
        }
        mDBHelper = new ToeflAvatarDbHelper(activity);
        Log.d(LOG_TAG, "onAttach");
    }

    @Override
    public void onDetach() {
        super.onDetach();

        mDBHelper = null;
    }

    @Override
    public void onCreateContextMenu(ContextMenu menu, View v,
                                    ContextMenu.ContextMenuInfo menuInfo) {
        super.onCreateContextMenu(menu, v, menuInfo);
        MenuInflater inflater = getActivity().getMenuInflater();
        inflater.inflate(R.menu.context_menu, menu);
    }

    @Override
    public boolean onContextItemSelected(MenuItem item) {
        AdapterView.AdapterContextMenuInfo info =
                (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();
        Log.d(LOG_TAG, "item selected row id = " + info.id);

        switch (item.getItemId()) {
            case R.id.menu_delete_item: {
                String selection = DataContract.RecordingEntry._ID + "=?";
                String[] selectionArgs = {String.valueOf(info.id)};
                mDBHelper.getWritableDatabase().delete(DataContract.RecordingEntry.TABLE_NAME,
                        selection, selectionArgs);
                reload();
                return true;
            }
            case R.id.menu_play_item: {
                String[] projection = {DataContract.RecordingEntry.COLUMN_NAME_ENTRY_FILENAME};
                String selection = DataContract.RecordingEntry._ID + "=?";
                String[] selectionArgs = {String.valueOf(info.id)};
                SQLiteDatabase db = mDBHelper.getReadableDatabase();
                Cursor cursor = db.query(
                        DataContract.RecordingEntry.TABLE_NAME,
                        projection,
                        selection,
                        selectionArgs,
                        null, null, null);
                if (cursor != null) {
                    cursor.moveToFirst();
                    String filename = cursor.getString(
                            cursor.getColumnIndexOrThrow(DataContract.RecordingEntry.COLUMN_NAME_ENTRY_FILENAME)
                    );
                    cursor.close();
                    MediaController.getInstance(getActivity()).startPlaying(filename);
                }
                return true;
            }
            default:
                return super.onContextItemSelected(item);
        }
    }

    public void populateRecordingsList(Context context) {
        Log.d(LOG_TAG, "populateRecordingsList");
        Cursor cursor = fetchAllRecordings();

        // The desired columns to be bound
        String[] projection = {
                DataContract.RecordingEntry.COLUMN_NAME_ENTRY_FILENAME,
                DataContract.RecordingEntry.COLUMN_NAME_ENTRY_TIMESTAMP,
                DataContract.RecordingEntry.COLUMN_NAME_ENTRY_DURATION
        };

        // the XML defined views which the data will be bound to
        int[] to = new int[] {
                R.id.record_file,
                R.id.record_timestamp,
                R.id.record_duration
        };

        mRecordCursorAdapter = new SimpleCursorAdapter(
                context,
                R.layout.record_item_view,
                cursor,
                projection,
                to,
                0);
        mRecordsListView.setAdapter(mRecordCursorAdapter);
        Log.d(LOG_TAG, "populateRecordingsList finished");
    }

    public Cursor fetchAllRecordings() {

        if (mDBHelper == null) {
            Log.e(LOG_TAG, "fetchAllRecordings mDBHelper == null");
            return null;
        }
        if (mItem == null) {
            Log.e(LOG_TAG, "fetchAllRecordings mItem == null");
        }

        SQLiteDatabase db = mDBHelper.getReadableDatabase();
        // Define a projection that specifies which columns from the database
        // you will actually use after this query.
        String[] projection = {
                DataContract.RecordingEntry._ID,
                DataContract.RecordingEntry.COLUMN_NAME_ENTRY_QUESTION_ID,
                DataContract.RecordingEntry.COLUMN_NAME_ENTRY_PATH,
                DataContract.RecordingEntry.COLUMN_NAME_ENTRY_FILENAME,
                DataContract.RecordingEntry.COLUMN_NAME_ENTRY_TIMESTAMP,
                DataContract.RecordingEntry.COLUMN_NAME_ENTRY_DURATION
        };

        Cursor cursor = db.query(
                DataContract.RecordingEntry.TABLE_NAME,  // The table to query
                projection,                            // The columns to return
                DataContract.RecordingEntry.COLUMN_NAME_ENTRY_QUESTION_ID + "=?",   // The columns for the WHERE clause
                new String[]{mItem.id},                            // The values for the WHERE clause
                null,                                     // don't group the rows
                null,                                     // don't filter by row groups
                null                                 // The sort order
        );
        if (cursor != null) cursor.moveToFirst();

        return cursor;
    }

    public void reload() {
        Log.d(LOG_TAG, "reload");
        if (mRecordCursorAdapter != null) {
            mRecordCursorAdapter.changeCursor(fetchAllRecordings());
        }
    }
}
