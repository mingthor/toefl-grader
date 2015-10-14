package com.appspot.toefl_avatar.languagelab;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.appspot.toefl_avatar.languagelab.data.DataContract;

import java.util.List;

/**
 * Question array adapter to manage the display of questions list
 */
public class QuestionArrayAdapter extends ArrayAdapter<DataContract.QuestionItem> {
    public QuestionArrayAdapter(Context context, List<DataContract.QuestionItem> questions) {
        super(context, 0, questions);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        DataContract.QuestionItem item = getItem(position);
        // Check if an existing view is being reused, otherwise inflate the view
        if (convertView == null)
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.question_item_view, parent, false);
        TextView txtId = (TextView) convertView.findViewById(R.id.txtQuestionId);
        txtId.setText(item.id);
        TextView txtTitle = (TextView) convertView.findViewById(R.id.txtTitle);
        txtTitle.setText(item.titleEnglish);
        TextView txtType = (TextView) convertView.findViewById(R.id.txtQuestionType);
        txtType.setText("Q" + item.type);
        return convertView;
    }
}
