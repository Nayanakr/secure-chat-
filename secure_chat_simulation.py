print("👋 Hello! Program is running...")


from cryptography.hazmat.primitives.asymmetric import rsa, padding


from cryptography.hazmat.primitives import serialization, hashes



def generate_keys(name):
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()

   
    with open(f"{name}_private.pem", "wb") as f:
        f.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ))

    
    with open(f"{name}_public.pem", "wb") as f:
        f.write(public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ))

    print(f" Keys generated for {name}")



def load_public_key(filename):
    with open(filename, "rb") as f:
        return serialization.load_pem_public_key(f.read())


def load_private_key(filename):
    with open(filename, "rb") as f:
        return serialization.load_pem_private_key(f.read(), password=None)



def encrypt_message(message, public_key):
    return public_key.encrypt(
        message.encode(),
        padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),
                     algorithm=hashes.SHA256(),
                     label=None)
    )


def decrypt_message(ciphertext, private_key):
    return private_key.decrypt(
        ciphertext,
        padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()),
                     algorithm=hashes.SHA256(),
                     label=None)
    ).decode()



generate_keys("nayana")
generate_keys("chris")


nayana_private = load_private_key("nayana_private.pem")
nayana_public = load_public_key("nayana_public.pem")

chris_private = load_private_key("chris_private.pem")
chris_public = load_public_key("chris_public.pem")


message_from_nayana = "Hi chris! This is a secret message from nayana."
print(f"\n nayana sends: {message_from_nayana}")
encrypted_msg = encrypt_message(message_from_nayana, chris_public)


decrypted_msg = decrypt_message(encrypted_msg, chris_private)
print(f" chris receives and decrypts: {decrypted_msg}")


message_from_chris = "Hi nayana! Got your message loud and clear!"
print(f"\n chris sends: {message_from_chris}")
encrypted_reply = encrypt_message(message_from_chris, nayana_public)


decrypted_reply = decrypt_message(encrypted_reply, nayana_private)
print(f" nayana receives and decrypts: {decrypted_reply}")
