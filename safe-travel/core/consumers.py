import json
import pandas as pd
import pickle
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
with open('scaler_kmeans.pkl', 'rb') as file:
    loaded_objects = pickle.load(file)

with open('cluster.json', 'r') as file:
    risk_data = json.load(file)

scaler = loaded_objects['scaler']
kmeans = loaded_objects['kmeans']

def find_risk_level(cluster, risk_data):
    for risk_level, clusters in risk_data.items():
        if cluster in clusters:
            return risk_level
    return "Cluster not found in any risk level."

class RiskPredictionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # if self.scope["user"].is_authenticated:
            await self.accept()
        # else:
        #     await self.close()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        user = self.scope['user']
        age = 25

        # Create a DataFrame with the provided data
        pd.set_option('display.float_format', lambda x: f'{x:.14f}')
        new_data = pd.DataFrame({
            "Vict Age": [age] * len(data),  # Repeat the age for each set of coordinates
            "LAT": [entry['latitude'] for entry in data],
            "LON": [entry['longitude'] for entry in data],
        })
        
        # Normalize and predict
        scaled_new_data = scaler.transform(new_data)
        predicted_clusters = kmeans.predict(scaled_new_data)
        
        # Find risk levels and construct response
        response = [
            {
                "coordinates": [entry['latitude'], entry['longitude']],
                "risk": find_risk_level(cluster, risk_data)
            }
            for entry, cluster in zip(data, predicted_clusters)
        ]

        await self.send(text_data=json.dumps(response))