import geminiClient from "../config/geminiClient.js";

const test = async()=>{

const response = await geminiClient.models.generateContent({
  model: "models/gemini-2.5-flash",
  contents: "Say, 'Howdy! ma boi' just as is"
});
  console.log(response.text)
}

test();
