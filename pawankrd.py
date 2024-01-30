import requests

def get_resp(messages:list[str],key:str,max_tokens:int=128,model:str='pai-001-light',temperature:float=0.7)->str:
    headers = {
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
    }

    json_data = {
        'model': model,
        'max_tokens': max_tokens,
        'temperature': temperature,
        'messages': messages,
    }

    response = requests.post('https://api.pawan.krd/v1/chat/completions', headers=headers, json=json_data)
    return response.json()["choices"][0]["message"]["content"]