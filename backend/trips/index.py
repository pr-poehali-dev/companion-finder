import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управление поездками: добавление новой поездки и поиск попутчиков
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            full_name = body_data.get('fullName', '')
            train_number = body_data.get('trainNumber', '')
            departure_date = body_data.get('departureDate', '')
            departure_time = body_data.get('departureTime', '')
            arrival_date = body_data.get('arrivalDate', '')
            arrival_time = body_data.get('arrivalTime', '')
            car_number = body_data.get('carNumber', '')
            seat_number = body_data.get('seatNumber', '')
            contact_info = body_data.get('contactInfo', '')
            additional_info = body_data.get('additionalInfo', '')
            
            with conn.cursor() as cur:
                cur.execute('''
                    INSERT INTO trips 
                    (full_name, train_number, departure_date, departure_time, 
                     arrival_date, arrival_time, car_number, seat_number, 
                     contact_info, additional_info)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (full_name, train_number, departure_date, departure_time,
                      arrival_date, arrival_time, car_number, seat_number,
                      contact_info, additional_info))
                
                trip_id = cur.fetchone()[0]
                conn.commit()
                
                cur.execute('''
                    SELECT id, full_name, train_number, departure_date, departure_time,
                           arrival_date, arrival_time, car_number, seat_number,
                           contact_info, additional_info
                    FROM trips
                    WHERE train_number = %s
                      AND departure_date = %s
                      AND arrival_date = %s
                      AND departure_time = %s
                      AND arrival_time = %s
                      AND car_number = %s
                      AND full_name != %s
                ''', (train_number, departure_date, arrival_date, departure_time,
                      arrival_time, car_number, full_name))
                
                companions = []
                for row in cur.fetchall():
                    companions.append({
                        'id': row[0],
                        'fullName': row[1],
                        'trainNumber': row[2],
                        'departureDate': str(row[3]),
                        'departureTime': str(row[4]),
                        'arrivalDate': str(row[5]),
                        'arrivalTime': str(row[6]),
                        'carNumber': row[7],
                        'seatNumber': row[8],
                        'contactInfo': row[9],
                        'additionalInfo': row[10]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'tripId': trip_id,
                        'companions': companions
                    }),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            full_name = params.get('fullName', '')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('''
                    SELECT id, full_name, train_number, departure_date, departure_time,
                           arrival_date, arrival_time, car_number, seat_number
                    FROM trips
                    WHERE full_name = %s
                    ORDER BY departure_date DESC
                ''', (full_name,))
                
                trips = []
                for row in cur.fetchall():
                    trips.append({
                        'id': row['id'],
                        'fullName': row['full_name'],
                        'trainNumber': row['train_number'],
                        'departureDate': str(row['departure_date']),
                        'departureTime': str(row['departure_time']),
                        'arrivalDate': str(row['arrival_date']),
                        'arrivalTime': str(row['arrival_time']),
                        'carNumber': row['car_number'],
                        'seatNumber': row['seat_number']
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'trips': trips}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    finally:
        conn.close()
