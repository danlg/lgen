#here we generate the key for the app, we provide the password manually
keytool -genkey -keyalg RSA  -keysize 2048 -validity 10000 -alias com.gosmartix.smartix
