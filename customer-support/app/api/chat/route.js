import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

// Initialize the client with the API key
const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

const systemPrompt = "How can I help you today?";

let lastPrompt = "";
// Define a function to perform the text generation request
async function getTextGeneration(userQuery) {
    try {
        const prompt = `
            You are a customer support agent for "PAAW," a tech company. Respond politely and empathetically to customer queries. Follow these guidelines:
            
            1. If the customer mentions a late order, apologize and assure them the order will be delivered within 2 working days.
            2. If the customer requests a refund, inform them that the refund process will be completed within 2 working days.
            3. If the customer gives positive feedback, thank them warmly and express your appreciation.
            4. If the customer is extremely angry, offer a compensation voucher as a goodwill gesture.
            5. For other issues, mention that the problem has been forwarded to the respective team for further action.

            Here's the previous context: "${lastPrompt}"        
            Now, answer the following customer query:

            Customer: "${userQuery}"
            Assistant:`;

        // Send the request to the Hugging Face API
        const response = await client.textGeneration({
            model: "mistralai/Mistral-Nemo-Instruct-2407",
            inputs: prompt,
            parameters: {
                max_length: 150,
                temperature: 0.7,
                top_k: 50,
            },
        });

        // Extract the assistant's response

        const generatedText = response.generated_text;
        const assistantResponse = generatedText.split("Assistant:")[1].trim().replace('"', '').replace('"', '') || "Can you please rephrase or clarify what you need help with?";
        
        lastPrompt = assistantResponse;
        return assistantResponse;
    } catch (error) {
        console.error('API Request failed:', error?.response?.data || error.message);
        throw error;
    }
}

// Define the API route handler
export async function POST(req) {
    try {
        // Extract user input from the request
        const data = await req.json();
        const userQuery = data.query || "";

        // Get the response from the assistant
        const assistantResponse = await getTextGeneration(userQuery);

        // Return the generated response
        return new NextResponse(JSON.stringify({ message: 'Response from the Assistant', data: { generated_text: assistantResponse } }), { status: 200 });
    } catch (error) {
        // Handle errors and return a 500 status
        return new NextResponse(JSON.stringify({ message: 'Error occurred', error: error.message }), { status: 500 });
    }
}
