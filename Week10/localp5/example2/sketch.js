let prompt = 'Who are you?';

async function setup() {
  let url = 'https://localhost:11434/api/chat';
  let response = await fetch(url);
  let json = await response.json();
  console.log(json);
}
  
function draw() {
    background(220);
}