import math
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
import os
from pypdf import PdfReader
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import wikipedia
from pyvis.network import Network
import IPython
from pypdf import PdfReader
from datasets.load import requests
import re
import gensim
from gensim.utils import simple_preprocess
import nltk
nltk.download("stopwords")
import spacy
nlp=spacy.load('en_core_web_sm',disable=['parser', 'ner'])
from nltk.corpus import stopwords
import gensim.corpora as corpora
from gensim.models import CoherenceModel
from pprint import pprint








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

    # Can consider just summarising page by page

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

# Start of knowledge based section ---------------------------------------------------------
def execute_text_to_knowledge(filepath, uploadId, span_length, verbose=True):

    # Loading model and Tokenizers
    tokenizer = AutoTokenizer.from_pretrained("Babelscape/rebel-large")
    model = AutoModelForSeq2SeqLM.from_pretrained("Babelscape/rebel-large")
    print(filepath)

    if os.path.splitext(filepath)[1].lower() == '.pdf':
        with open(filepath, 'rb') as file:
            reader = PdfReader(file)
            text = ""
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text()
    else:
        with open(filepath) as src:
            text = src.read()

    # tokenize whole text
    inputs = tokenizer([text], return_tensors="pt", max_length=20000, truncation=True)
    print(inputs)

    # compute span boundaries
    num_tokens = len(inputs["input_ids"][0])
    if verbose:
        print(f"Input has {num_tokens} tokens")
    num_spans = math.ceil(num_tokens / span_length)
    if verbose:
        print(f"Input has {num_spans} spans")
    overlap = math.ceil((num_spans * span_length - num_tokens) / 
                        max(num_spans - 1, 1))
    spans_boundaries = []
    start = 0
    for i in range(num_spans):
        spans_boundaries.append([start + span_length * i,
                                 start + span_length * (i + 1)])
        start -= overlap
    if verbose:
        print(f"Span boundaries are {spans_boundaries}")

    # transform input with spans
    print('transform input with spans')
    tensor_ids = [inputs["input_ids"][0][boundary[0]:boundary[1]]
                  for boundary in spans_boundaries]
    tensor_masks = [inputs["attention_mask"][0][boundary[0]:boundary[1]]
                    for boundary in spans_boundaries]
    inputs = {
        "input_ids": torch.stack(tensor_ids),
        "attention_mask": torch.stack(tensor_masks)
    }

    # generate relations
    print('generate relations')
    num_return_sequences = 3
    gen_kwargs = {
        "max_length": 256,
        "length_penalty": 0,
        "num_beams": 3,
        "num_return_sequences": num_return_sequences
    }
    generated_tokens = model.generate(
        **inputs,
        **gen_kwargs,
    )

    # decode relations
    print('decode relations')
    decoded_preds = tokenizer.batch_decode(generated_tokens,
                                           skip_special_tokens=False)

    # create kb
    print('create kb')
    kb = KB()
    i = 0
    for sentence_pred in decoded_preds:
        current_span_index = i // num_return_sequences
        relations = extract_relations_from_model_output(sentence_pred)
        for relation in relations:
            relation["meta"] = {
                "spans": [spans_boundaries[current_span_index]]
            }
            kb.add_relation(relation)
        i += 1
    
    output_path = save_network_html(kb,uploadId)
    kb.print()
    return output_path

class KB():
    def __init__(self):
        self.entities = {}
        self.relations = []

    def are_relations_equal(self, r1, r2):
        return all(r1[attr] == r2[attr] for attr in ["head", "type", "tail"])
    
    def get_wikipedia_data(self, candidate_entity):
        try:
            page = wikipedia.page(candidate_entity, auto_suggest=False)
            entity_data = {"title": page.title,
                           "url": page.url,
                           "summary": page.summary}
            return entity_data
        except:
            return None
        
    def add_entity(self, e):
        self.entities[e["title"]] = {k:v for k, v in e.items() if k != "title"}

    def exists_relation(self, r1):
        return any(self.are_relations_equal(r1, r2) for r2 in self.relations)
    
    def merge_relations(self, r1):
        r2 = [r for r in self.relations if self.are_relations_equal(r1, r)][0]
        spans_to_add = [span for span in r1["meta"]["spans"] if span not in r2["meta"]["spans"]]
        r2["meta"]["spans"] += spans_to_add
    
    def add_relation(self, r):
        # We now first check on wikipedia
        candidate_entities = [r["head"], r["tail"]]
        entities = [self.get_wikipedia_data(ent) for ent in candidate_entities]

        # If one of the entities does not exist, stop
        if any(ent is None for ent in entities):
            return
        
        # Managing new entities
        for e in entities:
            self.add_entity(e)

        # Renaming relation entities with their wikipedia titles
        r["head"] = entities[0]["title"]
        r["tail"] = entities[1]["title"]

        # Managing the new relation
        if not self.exists_relation(r):
            self.relations.append(r)
        else:
            self.merge_relations(r)

    def print(self):
        print("Entities:")
        for e in self.entities.items():
            print(f"  {e}")
        print("Relations:")
        for r in self.relations:
            print(f"  {r}")

def extract_relations_from_model_output(text):
    relations = []
    relation, subject, relation, object_ = '', '', '', ''
    text = text.strip()
    current = 'x'
    text_replaced = text.replace("<s>", "").replace("<pad>", "").replace("</s>", "")
    for token in text_replaced.split():
        if token == "<triplet>":
            current = 't'
            if relation != '':
                relations.append({
                    "head": subject.strip(),
                    "type": relation.strip(),
                    "tail": object_.strip()
                })
                relation = ''
            subject = ''
        elif token == "<subj>":
            current = 's'
            if relation != '':
                relations.append({
                    "head": subject.strip(),
                    "type": relation.strip(),
                    "tail": object_.strip()
                })
            object_ = ''
        elif token == "<obj>":
            current = 'o'
            relation = ''
        else:
            if current == 't':
                subject += ' ' + token
            elif current == 's':
                object_ += ' ' + token
            elif current == 'o':
                relation += ' ' + token
    
    if subject != '' and relation != '' and object_ != '':
        relations.append({
            "head": subject.strip(),
            "type": relation.strip(),
            "tail": object_.strip()
        })
    
    return relations

def save_network_html(kb, uploadId):
    # Creating the empty network
    net = Network(directed=True, width="700px", height="700px", bgcolor="#eeeeee", notebook=True, cdn_resources='in_line')

    # nodes
    color_entity = "#00FF00"
    for e in kb.entities:
        net.add_node(e, shape="circle", color=color_entity)

    # Edges
    for r in kb.relations:
        net.add_edge(r["head"], r["tail"], title=r["type"], label=r["type"])

    # Saving the network
    net.repulsion(node_distance=200,
                  central_gravity=0.2,
                  spring_length=200,
                  spring_strength=0.05,
                  damping=0.09)
    net.set_edge_smooth("dynamic")
    html = net.generate_html()
    output_path = os.path.join(static_dir, 'graphs',uploadId +'.html').replace("\\","/")
    with open(output_path, mode='w', encoding='utf-8') as fp:
        fp.write(html)
    
    return output_path
# End of knowledge based section ------------------------------------------------------------

#Start of LDA section -----------------------------------------------------------------------
def execute_lda_model(url, uploadId):
    docs = list(extract_documents_from_pdf(url,uploadId))
    print('from lda model >>>>>')
    print(docs)
    docs = clean_document(docs)
    processed_data = list(tokeniz(docs))

    stop_words = stopwords.words('english')
    stop_words.extend(['from', 'subject', 're', 'edu', 'use','for'])
    data_wo_stopwords = remove_stopwords(processed_data,stop_words)

    bigram = gensim.models.Phrases(processed_data, min_count=5, threshold=100)
    bigram_mod = gensim.models.phrases.Phraser(bigram)
    data_bigrams = create_bigrams(data_wo_stopwords,bigram_mod)
    data_lemmatized = lemmatize(data_bigrams, allowed_postags=[ 'NOUN', 'ADJ', 'VERB'])

    gensim_dictionary = corpora.Dictionary(data_lemmatized)
    texts = data_lemmatized
    gensim_corpus = [gensim_dictionary.doc2bow(text) for text in texts]
    [[(gensim_dictionary[id], freq) for id, freq in cp] for cp in gensim_corpus[:4]]

    lda_model = gensim.models.ldamodel.LdaModel(
        corpus=gensim_corpus, id2word=gensim_dictionary, num_topics=15, random_state=100, 
        update_every=1, chunksize=100, passes=10, alpha='auto', per_word_topics=True)
    
    coherence_model_lda = CoherenceModel(model=lda_model, texts=data_lemmatized, dictionary=gensim_dictionary, coherence='c_v')

    coherence_lda = coherence_model_lda.get_coherence()
    print('\nCoherence Score: ', coherence_lda)

    top_topics = lda_model.top_topics(gensim_corpus)

    # Average topic coherence is the sum of topic coherences of all topics, divided by the number of topics.
    avg_topic_coherence = sum([t[1] for t in top_topics]) / 15
    print('Average topic coherence: %.4f.' % avg_topic_coherence)
    pprint(top_topics)

    # Find the topic with the highest coherence score
    top_top_word = []
    seen_words = set()

    for topic_words, coherence_score in top_topics:
        # Get the word with the highest probability in the topic
        top_word = max(topic_words, key=lambda x: x[0])
        print(top_word)
        
        if top_word[1] not in seen_words:
            top_top_word.append(top_word)
            seen_words.add(top_word[1]) 
            
    # Print the top word and its probability
        print("Top Word in Topic:")
        print("Word:", top_word[1])
        print("Coherence Score:", top_word[0])
        print()
    print(top_top_word)
    print(seen_words)

    # Sort the subjects based on coherence scores
    sorted_subjects = sorted(top_top_word, key=lambda x: x[0], reverse=True)
    print(sorted_subjects)

    # Get the top 5 subjects
    top_5_subjects = sorted_subjects[:5]
    top_subjects_to_be_returned = []

    # Print the top 5 subjects
    for i, (coherence_score,subject) in enumerate(top_5_subjects, 1):
        top_subjects_to_be_returned.append(subject)
        print(f"Top Subject {i}:")
        print("Subject:", subject)
        print("Coherence Score:", coherence_score)

    return top_subjects_to_be_returned


def extract_documents_from_pdf(url, uploadId):

    output_path = os.path.join(static_dir, 'temp',uploadId)
    print(output_path) 
    print(url)

    response = requests.get(url)
    contentType = response.headers.get('content-type')        
    with open(output_path, 'wb') as f:
            f.write(response.content)

    if 'pdf' in contentType.lower():
        with open(output_path, 'rb') as f:
            pdf_reader = PdfReader(f)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                yield page.extract_text()
    elif 'text' in contentType.lower():
        content = response.content.decode('utf-8')
        yield content
            
def clean_document(docs):
    cleaned_docs = []

    for doc in docs:
        punc_removed = re.sub('[,\.!?]', '', doc)
        case_lowered = punc_removed.lower()
        fillers_removed_doc = re.sub(
            r'\b(?:okay|right|going|thing|kind|really|thing|one|lot|see|look|might|actually|now|different|pretty|think|kind|maybe|want|need|understand|well|like|little|could|say|also|all|can|will|welcome|our|first|lecture|to|up|try|broadly|where|is|about|the|just|do|get)\b',
            '',
            case_lowered
        )
        cleaned_docs.append(fillers_removed_doc)
    return cleaned_docs
    
def tokeniz(sentences):

    for sentence in sentences:
        yield(gensim.utils.simple_preprocess(str(sentence), deacc=True))

def remove_stopwords(texts,stop_words):

    return [[word for word in simple_preprocess(str(doc)) if word not in stop_words] for doc in texts]

def lemmatize(texts, allowed_postags=['NOUN', 'ADJ', 'VERB']):

    texts_op = []

    for sent in texts:

        doc = nlp(" ".join(sent))
        texts_op.append([token.lemma_ for token in doc if token.pos_ in allowed_postags])

    return texts_op

def create_bigrams(texts,bigram_mod):

    return [bigram_mod[doc] for doc in texts]