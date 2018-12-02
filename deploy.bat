now --public --regions all -e MONGODB_USERNAME=@mongodb_username -e MONGODB_PASSWORD=@mongodb_password -e EMAIL_ADDRESS=@email_address -e EMAIL_PASSWORD=@email_password -e API_KEY=@api_key
now alias openmc.net
now scale openmc.net 1 1
pause