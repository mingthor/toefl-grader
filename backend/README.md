## API using Endpoints Frameworks v2 Python

Visit the following page for details
 https://cloud.google.com/endpoints/docs/frameworks/python/quickstart-frameworks-python

To generate the required configuration file:
python lib/endpoints/endpointscfg.py get_swagger_spec grader.GraderApi --hostname grader-api.endpoints.toefl-grader.cloud.goog

To deploy the OpenAPI configuration file:
gcloud service-management deploy toefl_graderv1openapi.json

To deploy the API:
gcloud app deploy