import requests
import json

payload = {"username":"user", "password":"userpw"}
# To send a json body, need to set the header to content-type json, probably cuz by default it does form, so it was set to form
# Or, just use the json= instead of data, that sets header automatically to json
response = requests.put("http://localhost:6969/account", json=payload)
print(response.json())

response = requests.post("http://localhost:6969/login", data=payload)
# No json.dumps, and no header for content-type defaults to url-form-encoded
data = response.json()
print(data)

headers = {"Authorization":data["access_token"]}
response = requests.get("http://localhost:6969/protected", headers=headers)
print(response.json())

response = requests.delete("http://localhost:6969/account", headers=headers)
print(response.json())

# After the user is already deleted
response = requests.post("http://localhost:6969/login", data=payload)
print(response.json())
