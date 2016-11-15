package com.appspot.toefl_avatar.backend;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.QueryResultIterator;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.cmd.Query;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.annotation.Nullable;
import javax.inject.Named;

import static com.googlecode.objectify.ObjectifyService.ofy;

/**
 * WARNING: This generated code is intended as a sample or starting point for using a
 * Google Cloud Endpoints RESTful API with an Objectify entity. It provides no data access
 * restrictions and no data validation.
 * <p/>
 * DO NOT deploy this code unchanged as part of a real application to real users.
 */
@Api(
        name = "quoteApi",
        version = "v1",
        resource = "quote",
        namespace = @ApiNamespace(
                ownerDomain = "backend.toefl_avatar.appspot.com",
                ownerName = "backend.toefl_avatar.appspot.com",
                packagePath = ""
        )
)
public class QuoteEndpoint {

    private static final Logger logger = Logger.getLogger(QuoteEndpoint.class.getName());

    private static final int DEFAULT_LIST_LIMIT = 20;

    static {
        // Typically you would register this inside an OfyServive wrapper. See: https://code.google.com/p/objectify-appengine/wiki/BestPractices
        ObjectifyService.register(Quote.class);
    }

    /**
     * Returns the {@link Quote} with the corresponding ID.
     *
     * @param id the ID of the entity to be retrieved
     * @return the entity with the corresponding ID
     * @throws NotFoundException if there is no {@code Quote} with the provided ID.
     */
    @ApiMethod(
            name = "get",
            path = "quote/{id}",
            httpMethod = ApiMethod.HttpMethod.GET)
    public Quote get(@Named("id") Long id) throws NotFoundException {
        logger.info("Getting Quote with ID: " + id);
        Quote quote = ofy().load().type(Quote.class).id(id).now();
        if (quote == null) {
            throw new NotFoundException("Could not find Quote with ID: " + id);
        }
        return quote;
    }

    /**
     * Inserts a new {@code Quote}.
     */
    @ApiMethod(
            name = "insert",
            path = "quote",
            httpMethod = ApiMethod.HttpMethod.POST)
    public Quote insert(Quote quote) {
        // Typically in a RESTful API a POST does not have a known ID (assuming the ID is used in the resource path).
        // You should validate that quote.id has not been set. If the ID type is not supported by the
        // Objectify ID generator, e.g. long or String, then you should generate the unique ID yourself prior to saving.
        //
        // If your client provides the ID then you should probably use PUT instead.
        ofy().save().entity(quote).now();
        logger.info("Created Quote with ID: " + quote.getId());

        return ofy().load().entity(quote).now();
    }

    /**
     * Updates an existing {@code Quote}.
     *
     * @param id    the ID of the entity to be updated
     * @param quote the desired state of the entity
     * @return the updated version of the entity
     * @throws NotFoundException if the {@code id} does not correspond to an existing
     *                           {@code Quote}
     */
    @ApiMethod(
            name = "update",
            path = "quote/{id}",
            httpMethod = ApiMethod.HttpMethod.PUT)
    public Quote update(@Named("id") Long id, Quote quote) throws NotFoundException {
        // TODO: You should validate your ID parameter against your resource's ID here.
        checkExists(id);
        ofy().save().entity(quote).now();
        logger.info("Updated Quote: " + quote);
        return ofy().load().entity(quote).now();
    }

    /**
     * Deletes the specified {@code Quote}.
     *
     * @param id the ID of the entity to delete
     * @throws NotFoundException if the {@code id} does not correspond to an existing
     *                           {@code Quote}
     */
    @ApiMethod(
            name = "remove",
            path = "quote/{id}",
            httpMethod = ApiMethod.HttpMethod.DELETE)
    public void remove(@Named("id") Long id) throws NotFoundException {
        checkExists(id);
        ofy().delete().type(Quote.class).id(id).now();
        logger.info("Deleted Quote with ID: " + id);
    }

    /**
     * List all entities.
     *
     * @param cursor used for pagination to determine which page to return
     * @param limit  the maximum number of entries to return
     * @return a response that encapsulates the result list and the next page token/cursor
     */
    @ApiMethod(
            name = "list",
            path = "quote",
            httpMethod = ApiMethod.HttpMethod.GET)
    public CollectionResponse<Quote> list(@Nullable @Named("cursor") String cursor, @Nullable @Named("limit") Integer limit) {
        limit = limit == null ? DEFAULT_LIST_LIMIT : limit;
        Query<Quote> query = ofy().load().type(Quote.class).limit(limit);
        if (cursor != null) {
            query = query.startAt(Cursor.fromWebSafeString(cursor));
        }
        QueryResultIterator<Quote> queryIterator = query.iterator();
        List<Quote> quoteList = new ArrayList<>(limit);
        while (queryIterator.hasNext()) {
            quoteList.add(queryIterator.next());
        }
        return CollectionResponse.<Quote>builder().setItems(quoteList).setNextPageToken(queryIterator.getCursor().toWebSafeString()).build();
    }

    private void checkExists(Long id) throws NotFoundException {
        try {
            ofy().load().type(Quote.class).id(id).safe();
        } catch (com.googlecode.objectify.NotFoundException e) {
            throw new NotFoundException("Could not find Quote with ID: " + id);
        }
    }
}