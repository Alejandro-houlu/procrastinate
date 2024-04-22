import json
import mimetypes
from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from procrastinate.jwtMiddleware import jwtMiddleware

from . import ml_model
from .models import Uploads, get_user
from . import services
from django.views.decorators.http import require_GET, require_POST
import boto3

user = get_user()
jwt_Middleware = jwtMiddleware(get_response=None)

def index(request):
    my_dict = {'insert_me': "From views.py"}
    return render(request,'procrastinate/index.html', context=my_dict)

@csrf_exempt
@jwt_Middleware.authenticated_required
def home(request):
    print(request.username)
    return HttpResponse(user)

@csrf_exempt
def pong(request):
    if request.method == 'GET':      
        return HttpResponse('pong')
    else:
        return HttpResponse('invalid request',status=400)

@csrf_exempt
@require_POST
def authToken(request):
    return HttpResponse('hello')
    
@csrf_exempt
@require_POST
@jwt_Middleware.authenticated_required
def speechToText(request):

    print('hello from speech to text api')
    speechToText_location = 'speechToText'

    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception as ex:
        print('error in json load', ex)

    username = data.get('username')
    uploadId = data.get('uploadId')
    contentUrl = data.get('contentUrl')
    contentType = data.get('contentType')

    upload = Uploads()
    upload.username = username
    upload.upload_id = uploadId
    upload.content_url = contentUrl
    upload.content_type = contentType

    print(upload)

    # download the file from s3
    # save to static/audio folder
    # return the file path for ml model to pick up the file 
    file_path = services.download_and_save_file(upload)

    if('audio' in contentType.lower()):
        # result map contains the output path - static/output and the transcribed text
        speechToTextResult_map = ml_model.execute_speech_to_text_model(file_path, uploadId)

        # Upload result file to s3 bucket and get its url
        speechToText_url = services.upload_result(speechToTextResult_map['output_path'], uploadId, username, speechToText_location)
        print('Speech to text url: ' + speechToText_url)

        # Persist the result url in the db
        services.update_db_uploads_url(uploadId,speechToText_url,'speechToTextFile')

    else:
        return HttpResponse({'Error:': 'Wrong file format'}, content_type='application/json',
                        status=400)

    response_data_map = {
        'result_url': speechToText_url,
        'result': speechToTextResult_map['transcribed_text'],
        'username': username,
        'uploadId': uploadId
    }
    response_data_json = json.dumps(response_data_map)
    
    return HttpResponse(response_data_json, content_type='application/json',
                        status=200)

@csrf_exempt
@require_POST
@jwt_Middleware.authenticated_required
def createSummary(request):
    print('hello from create summary api')

    summarizedText_location = 'summarizedTextFile'

    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception as ex:
        print('error in json load', ex)

    username = data.get('username')
    uploadId = data.get('uploadId')
    contentUrl = data.get('contentUrl')

    upload = Uploads()
    upload.username = username
    upload.upload_id = uploadId
    upload.content_url = contentUrl
    print(upload)

    # return the file path for ml model to pick up the file
    # I am doing this again because I want to eventually not use the app's file system and fully use our s3 bucket
    file_path = services.download_and_save_file(upload)
    result_map = ml_model.execute_text_summarization(file_path,uploadId)

    # Upload summarized text to s3 bucket and get its url
    summarizedText_url = services.upload_result(result_map['output_path'],uploadId, username, summarizedText_location )

    # Get topics from the file
    top_topics = ml_model.execute_lda_model(contentUrl,uploadId)
    services.execute_db_batch_save_uploads_topics(top_topics,upload)

    # Persist the result url into the db
    services.update_db_uploads_url(uploadId,summarizedText_url,'summarizedTextFile')

    topics_string = ', '.join(top_topics)
    response_data_map = {
        'result_url': summarizedText_url,
        'result': result_map['summarized_text'],
        'topics': topics_string,
        'username': username,
        'uploadId': uploadId
    }
    response_data_json = json.dumps(response_data_map)
    
    return HttpResponse(response_data_json, content_type='application/json',
                    status=200)

@csrf_exempt
@require_POST
@jwt_Middleware.authenticated_required
def createKnowledgeGraph(request):
    print('hello from create knowledge graph api')

    knowledgeGraph_location = 'knowledgeGraph'

    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception as ex:
        print('error in json load', ex)

    username = data.get('username')
    uploadId = data.get('uploadId')
    contentUrl = data.get('contentUrl')

    upload = Uploads()
    upload.username = username
    upload.upload_id = uploadId
    upload.content_url = contentUrl
    print(upload)

    file_path = services.download_and_save_file(upload)
    print(file_path)
    knowledgeGraph_output_path = ml_model.execute_text_to_knowledge(file_path,uploadId,128)
    print('Output path to be used to upload to s3 ' + knowledgeGraph_output_path)
    knowledgeGraph_url = services.upload_result(knowledgeGraph_output_path,uploadId, username, knowledgeGraph_location)
    print(knowledgeGraph_url)
    services.update_db_uploads_url(uploadId,knowledgeGraph_url,'knowledgeGraphFile')

    response_data_map = {
        'knowledge_graph_url': knowledgeGraph_url,
        'username': username,
        'uploadId': uploadId
    }
    response_data_json = json.dumps(response_data_map)

    return HttpResponse(response_data_json, content_type='application/json',
                    status=200)