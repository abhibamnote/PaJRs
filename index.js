const express = require('express');
const app = express();
require('dotenv').config();
const xray = require('x-ray');
const x = xray();

const {OpenAI} = require('langchain/llms/openai');
const {PromptTemplate} = require('langchain/prompts');
const {ConversationChain} = require('langchain/chains');
const bodyParser = require('body-parser');

// const {PDFLoader} = require('langchain/document_loaders/fs/pdf');

// const {UnstructuredLoader} = require('langchain/document_loaders/fs/unstructured')

// const loader = new PDFLoader("./some.pdf");
app.set("view engine", "ejs");
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.render('index');
})

app.post('/api/gpt', async (req, res)=>{
    const {url} = req.body;
    // const docs = await loader.load();

    // 'https://nikhilsaikarnatirollno69.blogspot.com/2023/09/a-85-year-old-male-patient-came-with.html'

    let text = await x(url, '.post-body');

    const model = new OpenAI({temperature: 0, modelName: "gpt-3.5-turbo-16k"});

    const template = `Below is a report submitted by a medical PG intern as part of a reflective writing assignment. Can you evaluate it critically along two lines.
    1. Bloom's taxonomy. What are points that demonstrate competency at each level of the Bloom's taxonomy? What are points that are missing at each level that could have been covered?
    2. Evaluate it along the following questions/rubric - a. What are the general knowledge learning points that we gain from this patient's data that is easily accessible online?  b. What are the particular discovery driven learning questions around this patient e.g. internal medicine, external medicine c. Clinical complexity - biological, psychological, social d. Thematic analysis and learning from it e. Showing positive and negative impact of the above learning on the patient outcomes f. Competence of intern along following lines - (i) Competence in patient data capture, (ii) Competence in asking questions around the captured patient data (also known as sorting the themes for thematic analysis), (iii) Competence in finding the answers to the above questions and generating learning points that may be already known to other more experienced and advanced learners or hitherto unknown to the world and takes us to the edge of discovery and promise of breaking new ground, (iv) Competence to demonstrate and communicate (through publications in local and global logs) as to how the above learning points gleaned from the individual patients can influence their own immediate illness outcomes as well as future similar patient illness outcomes.
    ====
    {question}`;

    const prompt = new PromptTemplate({template, inputVariables: ["question"]});

    const chain = new ConversationChain({llm: model, prompt});

    const result = await chain.call({question: text});


    res.json({
        results: result
    });
})



app.listen(process.env.PORT, ()=>{
    console.log("Connected to 4050");
})