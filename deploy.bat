now rm openmc.net -y
now --public --regions sfo -y -e MONGODB_USERNAME=@mongodb_username -e MONGODB_PASSWORD=@mongodb_password -e EMAIL_ADDRESS=@email_address -e EMAIL_PASSWORD=@email_password -e API_KEY=@api_key
now alias -y
now scale openmc.net 1 1