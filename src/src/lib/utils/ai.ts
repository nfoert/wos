import ollama from 'ollama';


async function askAi() {
    await ollama.chat({
        model: "llama3.1:8b",
        messages: [
            { role: "user", content: "Hello!" }
        ]
    }).then((response) => {
        console.log(response.message.content)
        return response.message.content
    }).catch((error) => {
        return error.message
    });
}

export { askAi }