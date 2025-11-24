import nltk
from nltk.corpus import words
from nltk.metrics import edit_distance

nltk.download('words')
correct_words = set(words.words())

def correct_word(word):

    if word.lower() in correct_words:
        return word
    
    else:
        candidates = [w for w in correct_words if w[0] == word[0].lower()]
        closest = min(candidates, key=lambda w: edit_distance(word.lower(), w))
        return closest