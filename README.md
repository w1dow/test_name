# Lumis

# Starting Olama 

OLLAMA_HOST=0.0.0.0:11434 ollama serve
@verify its working: curl http://localhost:11434/api/tags


# RUN
 1. OLLAMA_HOST=0.0.0.0:11434 ollama serve
 2. ollama list
 3. ollama pull llama3
 4. docker build -t chat-bot .
 5. docker run -p 3000:3000 \
    --network=host \
    -e PORT=3000 \
    -e OLLAMA_URL=http://localhost:11434 \
    -e MODEL=llama3 \
    chat-bot


# Update
 Got data from users email 
  next todo send it to backend for summary and get data from other apis as well and send them to llama

  #Need 
  Front-end
  dashboard 
  database where we can store auth tokens of different websites for users so that we dont have to login everytime