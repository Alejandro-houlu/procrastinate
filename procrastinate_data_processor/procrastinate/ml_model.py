from nbconvert.preprocessors import ExecutePreprocessor
from django.conf import settings
import numpy as np
import pandas as pd
import sklearn
from procrastinate_data_processor import settings
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
import scipy
from datasets import load_dataset
from pydub import AudioSegment
import librosa
import pickle
import os
from pypdf import PdfReader

static_dir = settings.STATIC_DIR
print("Static directory:", static_dir)

def execute_speech_to_text_model(file_path, uploadId):
    ### Loading model to device

    if os.name == 'nt':
        file_path = file_path.replace('\\', '/')

    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
    
    model_id = "openai/whisper-large-v3"
    
    model = AutoModelForSpeechSeq2Seq.from_pretrained(
        model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
    )
    model.to(device)
    
    processor = AutoProcessor.from_pretrained(model_id)
    
    pipe = pipeline(
        "automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        max_new_tokens=128,
        chunk_length_s=30,
        batch_size=16,
        return_timestamps=True,
        torch_dtype=torch_dtype,
        device=device,
    )
    
    dataset = load_dataset("distil-whisper/librispeech_long", "clean", split="validation")
    sample = dataset[0]["audio"]
    
    result = pipe(sample)
    print(result["text"])

    sample_audio_path = file_path
    print(sample_audio_path)

    y, sr = librosa.load(sample_audio_path)
    print(y)
    print(sr)

    text_result = pipe(y, generate_kwargs={"language": "english", "task": "transcribe"})
    print(text_result["text"])

    output_path = os.path.join(static_dir, 'text',uploadId) + ".txt"

    if os.name == 'nt':
        output_path = output_path.replace('\\', '/')

    print(output_path)
    transcribed_text = text_result["text"]
    with open(output_path, "w") as dst:
        dst.write(transcribed_text)
        
    speechToTextResult_map = {
        "output_path" : output_path,
        "transcribed_text" : transcribed_text
    }
    return speechToTextResult_map

def execute_text_summarization(filepath, uploadId):

    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

    if os.path.splitext(filepath)[1].lower() == '.pdf':
        with open(filepath, 'rb') as file:
            reader = PdfReader(file)
            textFile = ""
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                textFile += page.extract_text()
    else:
        with open(filepath) as src:
            textFile = src.readlines()[0]
        print(textFile)
    
    print(textFile)
    
    summarized_text = summarizer(textFile, max_length=230, min_length=30, do_sample=False, truncation=True)
    print(summarized_text[0]["summary_text"])

    output_path = os.path.join(static_dir, 'output',uploadId) + ".txt"

    if os.name == 'nt':
        output_path = output_path.replace('\\', '/')
    
    print(output_path)

    summarized_text = summarized_text[0]["summary_text"]
    with open(output_path, "w") as dst:
        dst.write(summarized_text)
    
    summarized_text_map = {
        "output_path" : output_path,
        "summarized_text": summarized_text
    }

    return summarized_text_map