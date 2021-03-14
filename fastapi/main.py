from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import uvicorn
import wikipediaapi
from nltk.tokenize.punkt import PunktSentenceTokenizer, PunktParameters
from pydantic import BaseModel

wiki_wiki = wikipediaapi.Wikipedia('en')

class DefIn(BaseModel):
    title: str

class DefOut(BaseModel):
    summary: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summary", response_model=DefOut)
async def summary(defIn: DefIn):
    global wiki_wiki
    page_py = wiki_wiki.page(defIn.title)
    punkt_params = PunktParameters()
    punkt_params.abbrev_types = set(['Mr', 'Mrs', 'Ms'])
    tokenizer = PunktSentenceTokenizer(punkt_params)
    summarytokens = tokenizer.tokenize(page_py.summary)
    response = {
        "summary": str(summarytokens[0]),
    }
    return response


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)