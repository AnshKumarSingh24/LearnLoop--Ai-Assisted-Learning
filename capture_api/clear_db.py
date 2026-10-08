import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL", "").strip('"\'')
key = os.environ.get("SUPABASE_ANON_KEY", "").strip('"\'')
supabase: Client = create_client(url, key)

try:
    # Delete all captures where id is not null (which means all of them)
    res = supabase.table("captures").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    print("Cleared captures table.")
except Exception as e:
    print("Error clearing captures:", e)
