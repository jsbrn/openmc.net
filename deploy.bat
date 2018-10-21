now rm openmc.net -y
now --public --regions sfo -y -e MONGODB_USERNAME=@mongodb_username -e MONGODB_PASSWORD=@mongodb_password
now alias -y
now scale openmc.net 1 1