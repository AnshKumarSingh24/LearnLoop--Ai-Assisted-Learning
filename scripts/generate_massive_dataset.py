import json
import random
import uuid
import datetime

# --- Configuration ---
NUM_RECORDS = 5000
OUTPUT_FILE = "datasets/capture_synthetic_corpus_5000.jsonl"

SOURCE_TYPES = ["email_import", "slack_chat", "voice_memo", "meeting_notes", "pdf_document"]
PROJECT_NAMES = ["Project Alpha", "Project Beta", "Autonav", "Q4 Marketing", "Website Redesign"]
PEOPLE = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace"]

# Basic templates for different source types
TEMPLATES = {
    "email_import": [
        "Hi {person},\n\nJust confirming the budget for {project} is set at ${amount}.\n\nBest,\n{sender}",
        "Team,\n\nThe deadline for {project} has been moved to {date}.\n\nRegards,\n{sender}",
        "FYI, the server migration for {project} will happen on {date}. Total cost is estimated at ${amount}.\n\nThanks,\nIT"
    ],
    "slack_chat": [
        "Hey {person}, did we agree on ${amount} for {project}?",
        "yea {project} is due {date} now lol",
        "Just wrapped up with {person}. {project} is looking good for {date} release.",
        "k. budget for {project} is ${amount} right?"
    ],
    "voice_memo": [
        "Uh, yeah, so I just talked to {person} and they said {project} needs to be done by {date}. The budget is like, what, ${amount}? We'll see.",
        "Meeting notes to self: {project} launch on {date}. Don't forget to tell {person} about the ${amount} cap."
    ],
    "meeting_notes": [
        "Attendees: {person}, {sender}\nTopic: {project}\n- Deadline: {date}\n- Budget Approved: ${amount}\n- Action Items: Pending",
        "{project} Sync:\n- Discussed {date} timeline with {person}.\n- Budget constraints: ${amount} max."
    ],
    "pdf_document": [
        "OFFICIAL PROJECT CHARTER\nProject: {project}\nLead: {person}\nApproved Budget: ${amount}\nDelivery Date: {date}\n\nCONFIDENTIAL",
        "INVOICE\nBilled to: {project} Team\nAmount Due: ${amount}\nDue Date: {date}\nContact: {person}"
    ]
}

def random_date():
    start_date = datetime.date(2026, 1, 1)
    end_date = datetime.date(2027, 12, 31)
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    return (start_date + datetime.timedelta(days=random_number_of_days)).strftime("%B %d, %Y")

def generate_record(idx, is_contradiction=False, contradiction_pair_id=None):
    source_type = random.choice(SOURCE_TYPES)
    project = random.choice(PROJECT_NAMES)
    person = random.choice(PEOPLE)
    sender = random.choice([p for p in PEOPLE if p != person])
    amount = random.randint(1, 100) * 1000
    date = random_date()
    
    # If generating a contradiction pair, deliberately change a key fact
    if is_contradiction:
        amount = amount + random.choice([-5000, 5000, 10000]) # conflicting budget
        date = random_date() # conflicting date

    template = random.choice(TEMPLATES[source_type])
    content = template.format(person=person, project=project, amount=amount, date=date, sender=sender)
    
    # Ground truth entities
    entities = [project, person]
    if "{sender}" in template:
        entities.append(sender)
    
    record = {
        "id": f"cap_{uuid.uuid4().hex[:8]}",
        "source_type": source_type,
        "content": content,
        "timestamp": datetime.datetime.now().isoformat() + "Z",
        "ground_truth_entities": list(set(entities)),
        "metadata": {
            "project": project,
            "amount_mentioned": amount,
            "date_mentioned": date
        }
    }
    
    if contradiction_pair_id:
        record["contradiction_pair_id"] = contradiction_pair_id
        
    return record

def main():
    print(f"Generating {NUM_RECORDS} synthetic records...")
    records = []
    
    # 5% of records will be contradiction pairs
    num_contradictions = int(NUM_RECORDS * 0.05)
    
    for i in range(NUM_RECORDS - num_contradictions):
        records.append(generate_record(i))
        
    # Generate planted contradictions
    print(f"Planting {num_contradictions} contradiction pairs...")
    for i in range(num_contradictions):
        pair_id = f"conflict_{uuid.uuid4().hex[:6]}"
        # Generate base record
        base_record = generate_record(NUM_RECORDS - num_contradictions + i)
        base_record["contradiction_pair_id"] = pair_id
        
        # Extract base facts
        project = base_record["metadata"]["project"]
        person = base_record["ground_truth_entities"][1] if len(base_record["ground_truth_entities"]) > 1 else PEOPLE[0]
        
        # Generate contradicting record manually to ensure it targets the same project
        source_type = random.choice(SOURCE_TYPES)
        amount = base_record["metadata"]["amount_mentioned"] + random.choice([-5000, 5000])
        date = random_date()
        template = random.choice(TEMPLATES[source_type])
        content = template.format(person=person, project=project, amount=amount, date=date, sender=PEOPLE[0])
        
        conflict_record = {
            "id": f"cap_{uuid.uuid4().hex[:8]}",
            "source_type": source_type,
            "content": content,
            "timestamp": datetime.datetime.now().isoformat() + "Z",
            "ground_truth_entities": [project, person],
            "metadata": {
                "project": project,
                "amount_mentioned": amount,
                "date_mentioned": date
            },
            "contradiction_pair_id": pair_id
        }
        records.append(conflict_record)
        
    # Shuffle dataset
    random.shuffle(records)
    
    with open(OUTPUT_FILE, 'w') as f:
        for record in records:
            f.write(json.dumps(record) + '\n')
            
    print(f"Successfully generated dataset at {OUTPUT_FILE}")
    print(f"Total records: {len(records)}")
    print(f"Total contradiction pairs planted: {num_contradictions}")

if __name__ == "__main__":
    main()
