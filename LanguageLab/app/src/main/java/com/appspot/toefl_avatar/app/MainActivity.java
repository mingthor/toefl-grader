package com.appspot.toefl_avatar.app;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import com.appspot.toefl_avatar.app.data.DataContract;
import com.appspot.toefl_avatar.app.data.QuestionDataSource;


public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {

    // SectionHeaders
    private final static String[] questionTypes = new String[]{
                                        "Questions 1 & 2 - Familiar Topics",
                                        "Questions 3 & 4 - Campus Situation",
                                        "Questions 5 & 6 - Academic Course Content"};

    // Adapter for ListView Contents
    private SeparatedListAdapter adapter;

    // ListView Contents
    private ListView questionListView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        // Create the ListView Adapter
        adapter = new SeparatedListAdapter(this);
        QuestionDataSource.populateQuestionsList(getResources().getXml(R.xml.data), 0);
        QuestionArrayAdapter mQuestionsAdapter = new QuestionArrayAdapter(this, QuestionDataSource.ITEMS);

        // Add Sections
        for (String type :questionTypes) {
            adapter.addSection(type, mQuestionsAdapter);
        }

        // Get a reference to the ListView holder
        questionListView = (ListView) this.findViewById(R.id.list_journal);

        // Set the adapter on the ListView holder
        questionListView.setAdapter(adapter);

        // Listen for Click events
        questionListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long duration) {
                if (position <= QuestionDataSource.ITEMS.size()) {
                    DataContract.QuestionItem item = QuestionDataSource.ITEMS.get(position-1);
                    Intent detailIntent = new Intent(MainActivity.this, QuestionDetailActivity.class);
                    detailIntent.putExtra(QuestionDetailFragment.ARG_ITEM_ID, item.id);
                    startActivity(detailIntent);
                }
                Toast.makeText(MainActivity.this, "Out of Bound", Toast.LENGTH_SHORT);
            }
        });
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_camara) {
            // Handle the camera action
        } else if (id == R.id.nav_gallery) {

        } else if (id == R.id.nav_slideshow) {

        } else if (id == R.id.nav_manage) {

        } else if (id == R.id.nav_share) {

        } else if (id == R.id.nav_send) {

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

}
