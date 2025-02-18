import os
import pytesseract
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
from io import BytesIO

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("❌ Google API key is missing. Set 'GEMINI_API_KEY' in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:5173",  
    "http://localhost:3000",
]

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini model configuration
generation_config = {
    "temperature": 0.7,
    "top_p": 0.9,
    "max_output_tokens": 500,
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
    system_instruction="Your role is to extract medicinal information from prescriptions, including medicine names, dosages, frequencies, and other details. Be as precise as possible."
)

# Helper function to extract text using Tesseract OCR
def extract_text_from_image(image_data: bytes) -> str:
    try:
        # Open image from bytes
        image = Image.open(BytesIO(image_data))
        # Use Tesseract to extract text
        extracted_text = pytesseract.image_to_string(image)
        return extracted_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text from image: {str(e)}")

# Prescription extraction prompt template
def create_prescription_prompt(extracted_text: str) -> str:
    return f"""
    You are an AI assistant designed to extract and identify medicinal information from a prescription. The following prescription contains one or more medicines.
    
    Please extract all the medicine names from the given text and list them. For each identified medicine, provide the following details in a structured format:

    1. **Medicine Name**: The name of the medicine.
    2. **Purpose of the medicine**: Let the user know what the medication is commonly used for, based on web-sourced information (simple terms).
    3. **Dosage instructions and potential drug interactions**: Provide any relevant dosage instructions or warnings about potential drug interactions, side effects, or additional notes that might be important (not just what's written in the prescription, but based on general medical guidelines).

    Here is the prescription text:

    "{extracted_text}"

    Please list all the medicines and provide the requested information for each one. Be as precise as possible. If no details are available, leave the fields blank or mention that they are not provided.

    Thank you!
    """

# In-memory storage for storing bot responses
bot_responses = {}

#API for extracting text from prescription image and saving bot response
@app.post("/chat/uploadPrescription")
async def upload_prescription(image: UploadFile = File(...)):
    try:
        image_data = await image.read()
             
        extracted_text = extract_text_from_image(image_data)
        
        prompt = create_prescription_prompt(extracted_text)

        response = model.generate_content(prompt)
        bot_response = response.text.strip() if hasattr(response, "text") else "No response generated."

        bot_responses['latest'] = bot_response

        return {
            "extracted_text": extracted_text,
            "bot_response": bot_response
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing prescription: {str(e)}")

#API for getting the bot response
@app.get("/chat/getBotResponse")
async def get_bot_response():
    try:
        bot_response = bot_responses.get('latest', None)
        
        if not bot_response:
            raise HTTPException(status_code=404, detail="No bot response found. Please upload a prescription first.")
        
        return {"bot_response": bot_response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving bot response: {str(e)}")
