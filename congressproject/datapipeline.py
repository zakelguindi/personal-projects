import requests
import psycopg2
from datetime import datetime
from bs4 import BeautifulSoup

def fetch_election_results():
    """
    Scrapes election results from the Federal Election Commission (FEC) website.
    """
    FEC_URL = "https://www.fec.gov/data/elections/"
    response = requests.get(FEC_URL)
    if response.status_code != 200:
        print("Error fetching election results")
        return None
    
    soup = BeautifulSoup(response.text, 'html.parser')
    # Parse election data (customize based on actual structure)
    election_data = []
    for row in soup.select("table tr"):  # Example table parsing
        cols = row.find_all("td")
        if len(cols) > 0:
            election_data.append({
                "state": cols[0].text.strip(),
                "district": cols[1].text.strip(),
                "winner": cols[2].text.strip(),
                "party": cols[3].text.strip()
            })
    return election_data

def fetch_legislative_votes():
    """
    Fetches legislative voting records from GovTrack API.
    """
    GOVTRACK_API = "https://www.govtrack.us/api/v2/vote/"
    response = requests.get(GOVTRACK_API)
    if response.status_code != 200:
        print("Error fetching legislative votes")
        return None
    
    return response.json()["objects"]  # Assuming JSON response structure

def store_data_in_db(election_data, legislative_votes):
    """
    Stores election results and legislative votes in a PostgreSQL database.
    """
    conn = psycopg2.connect(
        dbname="supabase_db",
        user="your_user",
        password="your_password",
        host="your_host",
        port="your_port"
    )
    cur = conn.cursor()
    
    for result in election_data:
        cur.execute("""
            INSERT INTO election_results (state, district, winner, party, updated_at)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (state, district) DO UPDATE
            SET winner = EXCLUDED.winner, party = EXCLUDED.party, updated_at = EXCLUDED.updated_at
        """, (result["state"], result["district"], result["winner"], result["party"], datetime.now()))
    
    for vote in legislative_votes:
        cur.execute("""
            INSERT INTO legislative_votes (vote_id, bill_title, result, updated_at)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (vote_id) DO UPDATE
            SET result = EXCLUDED.result, updated_at = EXCLUDED.updated_at
        """, (vote["id"], vote["bill"].get("title", "Unknown"), vote["result"], datetime.now()))
    
    conn.commit()
    cur.close()
    conn.close()

def main():
    election_data = fetch_election_results()
    legislative_votes = fetch_legislative_votes()
    if election_data and legislative_votes:
        store_data_in_db(election_data, legislative_votes)

if __name__ == "__main__":
    main()
