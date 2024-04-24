import mimetypes
import os
from datasets.load import requests
from django.http import response

from procrastinate.models import Topics, Topics_Uploads, Uploads
from procrastinate_data_processor import settings
import boto3
from django.db import transaction

bucket_name ='procrastinatingbucket'

s3 = boto3.client(
    's3',
    region_name='sgp1',
    endpoint_url='https://sgp1.digitaloceanspaces.com/',
    aws_access_key_id=os.getenv('ACCESS_KEY'),
    aws_secret_access_key=os.getenv('SECRET_KEY')
)
def create_save_path(contentType, uploadId):
    
    if 'audio' in contentType.lower():
        save_path_audio = os.path.join(settings.STATIC_DIR, 'audio',uploadId)
        print('Save path (audio)',save_path_audio)
        return save_path_audio
    elif 'pdf' in contentType.lower():
        save_path_text = os.path.join(settings.STATIC_DIR,'text',uploadId + '.pdf')
        print('Save path (text)', save_path_text)
        return save_path_text
    elif 'text' in contentType.lower():
        save_path_text = os.path.join(settings.STATIC_DIR,'text',uploadId + '.txt')
        print('Save path (text)', save_path_text)
        return save_path_text
    else:
        print('Unknown file type')

# An Uploads object/model will be pass in 
def download_and_save_file(upload):

    try:
        print(upload.content_url)
        response = requests.get(upload.content_url)
        upload.content_type = response.headers.get('content-type')
        save_path = create_save_path(upload.content_type, upload.upload_id)

        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return save_path

    except Exception as ex:
        print('An error occured in download and save method')
        return None 

def upload_result(output_path, uploadId, username, location):
    s3_path = os.path.join('Procrastinate','Procrastinate '+ username,location,uploadId)
    content_type, _ = mimetypes.guess_type(output_path)
    print(content_type)
    
    try:
        s3.upload_file(output_path, bucket_name, s3_path,
                        ExtraArgs={'ACL': 'public-read',
                                    'ContentType': content_type, 
                                    'Metadata':
                                        {'username': username}})
    except Exception as ex:
        print('An error occured in upload result service')
        return None
    
    file_url = f"https://procrastinatingbucket.sgp1.digitaloceanspaces.com/{s3_path}"

    return file_url

def update_db_uploads_url(id,new_value,type):
    if type == 'speechToTextFile':
        num_of_rows = Uploads.objects.filter(upload_id=id).update(speechToText_url=new_value)
    elif type == 'summarizedTextFile':
        num_of_rows = Uploads.objects.filter(upload_id=id).update(result_url=new_value)
    elif type == 'knowledgeGraphFile':
        num_of_rows = Uploads.objects.filter(upload_id=id).update(knowledge_graph_url=new_value)


    if not num_of_rows:
        print('Update db was not successful for type = ' + type)
    else:
        print('Db sucessfully updated for type = ' + type)

def db_insert_topic(topic):

    # Check if the topic already exists in the database
    existing_topic = Topics.objects.filter(topic=topic).first()

    if existing_topic:
        # If the topic exists, return its ID
        existing_topic_id = existing_topic.topic_id  # pk is the primary key (ID) of the object
        print('Topic already exists in the database. ID:', existing_topic_id)
        return existing_topic
    else:
        # If the topic does not exist, create a new one
        new_topic = Topics(topic=topic)
        new_topic.save()
        new_topic_id = new_topic.topic_id  # pk is the primary key (ID) of the object
        print('New topic inserted into the database. ID:', new_topic_id)
        return new_topic
    
def db_insert_topic_upload(topicObj, upload):

    new_topic_upload = Topics_Uploads(topic_id = topicObj, upload_id=upload)
    new_topic_upload.save()
    print('Topic_upload table updated. TopicId: ', new_topic_upload.topic_id, 'and UploadId: ', new_topic_upload.upload_id)

@transaction.atomic
def execute_db_batch_save_uploads_topics(top_topics,upload):

    for topic in top_topics:
        topicObj = db_insert_topic(topic)
        db_insert_topic_upload(topicObj,upload)
