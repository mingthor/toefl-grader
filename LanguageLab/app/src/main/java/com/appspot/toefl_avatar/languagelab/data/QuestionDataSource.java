package com.appspot.toefl_avatar.languagelab.data;

import android.content.res.XmlResourceParser;
import android.util.Log;

import org.xmlpull.v1.XmlPullParserException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QuestionDataSource {

    /**
     * An array of question items.
     */
    public static List<DataContract.QuestionItem> ITEMS = new ArrayList<>();
    /**
     * A map of question items, by ID.
     */
    public static Map<String, DataContract.QuestionItem> ITEM_MAP = new HashMap<>();


    public static void populateQuestionsList(XmlResourceParser parser, int type) {
        try {
            int eventType = -1;
            ITEMS.clear();
            ITEM_MAP.clear();
            DataContract.QuestionItem question = null;
            while (eventType != XmlResourceParser.END_DOCUMENT) {
                String name = parser.getName();
                switch (eventType) {
                    case XmlResourceParser.START_TAG:
                        if (name.equals(DataContract.QuestionEntry.QUESTION_ITEM_NODE_NAME)) {
                            question = new DataContract.QuestionItem();
                        } else if (question != null) {
                            switch (name) {
                                case DataContract.QuestionEntry.QUESTION_ITEM_ATTR_ID:
                                    question.id = parser.nextText();
                                    break;
                                case DataContract.QuestionEntry.QUESTION_ITEM_ATTR_TYPE:
                                    question.type = parser.nextText();
                                    break;
                                case DataContract.QuestionEntry.QUESTION_ITEM_ATTR_TITLE:
                                    question.titleEnglish = parser.nextText();
                                    break;
                                case DataContract.QuestionEntry.QUESTION_ITEM_ATTR_TITLE_CH:
                                    question.titleChinese = parser.nextText();
                                    break;
                                case DataContract.QuestionEntry.QUESTION_ITEM_ATTR_CONTENT:
                                    question.content = parser.nextText().replaceAll("\\s+", " ");
                                    break;
                            }
                        }
                        break;
                    case XmlResourceParser.END_TAG:

                        if (name.equals(DataContract.QuestionEntry.QUESTION_ITEM_NODE_NAME)) {
                            assert (question != null);
                            if (type == 0 || Integer.parseInt(question.type) == type) {
                                addItem(question);
                                question = null;
                            }
                        }
                        break;
                }
                eventType = parser.next();
            }
            Log.d("XML file parser", "Done");
        } catch (XmlPullParserException | IOException e) {
            e.printStackTrace();
        }
    }

    private static void addItem(DataContract.QuestionItem item) {
        ITEMS.add(item);
        ITEM_MAP.put(item.id, item);

        Log.d("QuestionItem", item.toString());
    }

}
