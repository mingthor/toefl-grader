package com.appspot.toefl_avatar.languagelab.data;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * TODO: Make this class a singleton.
 * Database helper
 */
public class ToeflAvatarDbHelper extends SQLiteOpenHelper {
    // If you change the database schema, you must increment the database version.
    public static final int DATABASE_VERSION = 2;
    public static final String DATABASE_NAME = "ToeflAvatar.db";

    private static final String TEXT_TYPE = " TEXT";
    private static final String COMMA_SEP = ",";
    private static final String SQL_CREATE_RECORDING_ENTRIES =
            "CREATE TABLE " + DataContract.RecordingEntry.TABLE_NAME + " (" +
                    DataContract.RecordingEntry._ID + " INTEGER PRIMARY KEY AUTOINCREMENT," +
                    DataContract.RecordingEntry.COLUMN_NAME_ENTRY_QUESTION_ID + TEXT_TYPE + COMMA_SEP +
                    DataContract.RecordingEntry.COLUMN_NAME_ENTRY_TIMESTAMP + TEXT_TYPE + COMMA_SEP +
                    DataContract.RecordingEntry.COLUMN_NAME_ENTRY_FILENAME + TEXT_TYPE + COMMA_SEP +
                    DataContract.RecordingEntry.COLUMN_NAME_ENTRY_PATH + TEXT_TYPE + COMMA_SEP +
                    DataContract.RecordingEntry.COLUMN_NAME_ENTRY_DURATION + TEXT_TYPE +
                    // Any other options for the CREATE command
                    " )";

    private static final String SQL_DELETE_RECORDING_ENTRIES =
            "DROP TABLE IF EXISTS " + DataContract.RecordingEntry.TABLE_NAME;

    public ToeflAvatarDbHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(SQL_CREATE_RECORDING_ENTRIES);
    }
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // This database is only a cache for online data, so its upgrade policy is
        // to simply to discard the data and start over
        db.execSQL(SQL_DELETE_RECORDING_ENTRIES);
        onCreate(db);
    }
    public void onDowngrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        onUpgrade(db, oldVersion, newVersion);
    }

    public void insertRecordingItem(String questionId, String path, String filename,
                                    String timestamp, long durationInSeconds) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(DataContract.RecordingEntry.COLUMN_NAME_ENTRY_QUESTION_ID, questionId);
        values.put(DataContract.RecordingEntry.COLUMN_NAME_ENTRY_PATH, path);
        values.put(DataContract.RecordingEntry.COLUMN_NAME_ENTRY_FILENAME, filename);
        values.put(DataContract.RecordingEntry.COLUMN_NAME_ENTRY_TIMESTAMP, timestamp);
        values.put(DataContract.RecordingEntry.COLUMN_NAME_ENTRY_DURATION, durationInSeconds);
        db.insert(DataContract.RecordingEntry.TABLE_NAME, null, values);
    }
}
