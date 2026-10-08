import os
from groq import AsyncGroq

# We will initialize it lazily or safely so it doesn't crash on import if missing
def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return AsyncGroq(api_key=api_key)

async def generate_chat_response(messages: list, context_text: str) -> str:
    client = get_groq_client()
    if not client:
        return "Error: GROQ_API_KEY is not set in the environment variables."

    system_prompt = f"""You are Jarvis, an AI assistant for the Capture app.
You have access to the user's saved 'captures' in the current workspace.
Use the following context to answer their questions.

CONTEXT:
{context_text}
"""
    
    # Prepend the system prompt
    formatted_messages = [{"role": "system", "content": system_prompt}]
    
    # Add the user's history
    formatted_messages.extend(messages)

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=formatted_messages,
            max_tokens=1024,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error communicating with Groq: {str(e)}"

async def generate_image_description(base64_image: str, mime_type: str = "image/jpeg") -> str:
    client = get_groq_client()
    if not client:
        return ""
    
    try:
        response = await client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Please extract all text from this image and provide a brief description of what the image is about. Start with the description and then list the extracted text."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
            max_tokens=1024,
        )
        return response.choices[0].message.content or ""
    except Exception as e:
        print(f"Error communicating with Groq Vision: {str(e)}")
        return ""

async def synthesize_search_results(query: str, captures: list) -> tuple[str, list]:
    client = get_groq_client()
    if not client:
        return "Error: GROQ_API_KEY is not set in the environment variables.", []
    
    if not captures:
        return "No relevant information found to synthesize.", []

    context_text = ""
    sources = []
    
    for cap in captures:
        title = cap.get('title') or 'Untitled'
        type_ = cap.get('type') or 'text'
        content = cap.get('content') or cap.get('preview') or ''
        cap_id = cap.get('id')
        
        context_text += f"\n--- Capture ID: {cap_id} | Title: {title} (Type: {type_}) ---\n"
        context_text += f"{content}\n"
        sources.append(cap_id)

    system_prompt = f"""You are Jarvis, an AI assistant for the Capture app.
You have been asked to answer a user's query based ONLY on the provided captures.
If the information is not in the captures, explicitly state that you cannot answer based on the provided context.
DO NOT hallucinate information. 
When you use information from a capture, explicitly cite it by its Capture ID or Title.
"""
    
    formatted_messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Context:\n{context_text}\n\nQuery: {query}"}
    ]

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=formatted_messages,
            max_tokens=1024,
            temperature=0.7,
        )
        return response.choices[0].message.content, sources
    except Exception as e:
        return f"Error communicating with Groq: {str(e)}", sources
