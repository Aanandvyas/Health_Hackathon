import os
import time
from typing import Optional
from io import BytesIO
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool 
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

# --- SETUP ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("❌ Google API key is missing. Set 'GEMINI_API_KEY' in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="MentaAI Chat Server")

# --- CORS Configuration ---
origins = [
    "http://localhost:5173",  
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODEL CONFIGURATION ---
try:
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash-latest",
        system_instruction="""You are MentaAI, a friendly and empathetic AI assistant for mental wellness.
        If the user provides an image of a medical prescription, your primary role is to analyze it accurately. For each medicine, provide:
        1. Medicine Name
        2. Its common purpose
        3. Important instructions or potential side effects.
        For all other questions, provide supportive, helpful, and safe information related to mental wellness. Do not provide medical diagnoses.
        Structure your responses in clear, readable markdown."""
    )
except Exception as e:
    raise RuntimeError(f"Error configuring the GenerativeModel: {e}")


# --- API ENDPOINT ---
@app.post("/chat/sendMessage")
async def send_message(
    user_message: str = Form(""),
    patient_id: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    print("\n--- Request Received ---")
    start_time = time.time()
    
    try:
        content_to_send = []
        
        if user_message.strip():
            print(f"User message received: {user_message}")
            content_to_send.append(user_message)
        
        if image:
            print(f"Image received: {image.filename}")
            if not image.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Invalid file type.")

            image_data = await image.read()
            pil_image = Image.open(BytesIO(image_data))
            content_to_send.append(pil_image)
            print("Image processed successfully.")

        if not content_to_send:
            raise HTTPException(status_code=400, detail="Cannot send an empty message.")

        # --- NON-BLOCKING API CALL ---
        # We run the synchronous 'generate_content' function in a thread pool
        # to avoid blocking FastAPI's main event loop.
        print("Sending content to Gemini API...")
        
        response = await run_in_threadpool(model.generate_content, content_to_send)
        
        print("Response received from Gemini API.")
        
        end_time = time.time()
        print(f"Total processing time: {end_time - start_time:.2f} seconds")
        
        return {
            "bot_response": response.text,
            "patient_id": patient_id
        }

    except Exception as e:
        print(f"!!! An unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred while processing your message: {str(e)}")
