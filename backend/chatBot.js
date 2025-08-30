/*TODO
1.make a chat for cli first(the easy part)
2.try retriving infomation from the database 
3.make api requests for the above same(the hard part)
Go through the testing part
*/

// gemini-chatbot.js
import readline from 'readline';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// dotenv.config({path:'/backend/.env'});
dotenv.config();

class GeminiChatbot {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        this.chat = null;
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.botName = "Gemini Health Assistant";
    }

    async start() {
        console.log(`\n🤖 ${this.botName}: Initializing Gemini AI...`);
        
        // Start a new chat session
        this.chat = this.model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{text: "You are a helpful health and wellness assistant. Provide accurate, friendly health advice. Keep responses concise but informative."}]
                },
                {
                    role: "model",
                    parts: [{text: "Hello! I'm your health assistant. I provide accurate health information and wellness advice. How can I help you today?"}]
                }
            ],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        console.log(`\n🤖 ${this.botName}: Ready! Ask me anything about health and wellness. Type 'exit' to quit.\n`);
        this.askQuestion();
    }

    askQuestion() {
        this.rl.question('👤 You: ', async (input) => {
            await this.processInput(input.trim());
        });
    }

    async processInput(input) {
        if (this.shouldExit(input)) {
            this.sendResponse("Goodbye! Stay healthy! 👋");
            this.rl.close();
            return;
        }

        try {
            const response = await this.getGeminiResponse(input);
            this.sendResponse(response);
        } catch (error) {
            console.error('❌ Error:', error.message);
            this.sendResponse("I'm having trouble connecting. Please check your API key or internet connection.");
        }
        
        this.askQuestion();
    }

    shouldExit(input) {
        const exitCommands = ['exit', 'quit', 'bye', 'goodbye', 'stop'];
        return exitCommands.includes(input.toLowerCase());
    }

    async getGeminiResponse(input) {
        if (!this.chat) {
            throw new Error('Chat session not initialized');
        }

        const result = await this.chat.sendMessage(input);
        const response = await result.response;
        return response.text();
    }

    sendResponse(message) {
        // Format the response for better readability
        const formattedMessage = message
            .replace(/\*\*(.*?)\*\*/g, '\x1b[1m$1\x1b[0m') // Bold text
            .replace(/\*(.*?)\*/g, '\x1b[3m$1\x1b[0m');   // Italic text

        console.log(`\n🤖 ${this.botName}: ${formattedMessage}\n`);
    }

    close() {
        this.rl.close();
    }
}

// Handle errors and cleanup
process.on('SIGINT', () => {
    console.log('\n🤖 Chatbot: Goodbye! 👋');
    process.exit();
});

// Start the chatbot
try {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    
    const bot = new GeminiChatbot();
    bot.start();
} catch (error) {
    console.error('❌ Failed to start chatbot:', error.message);
    console.log('\nPlease make sure:');
    console.log('1. You have a GEMINI_API_KEY in your .env file');
    console.log('2. The API key is valid');
    console.log('3. You have internet connection');
    process.exit(1);
}