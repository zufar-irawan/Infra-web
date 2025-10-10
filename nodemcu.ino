#include <ESP8266WiFi.h>
#include <LiquidCrystal_I2C.h>
#include <MFRC522.h>
#include <WiFiManager.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <WiFiClientSecure.h>

const char *host = "localhost:8000";
const int httpsPort = 443;

LiquidCrystal_I2C lcd(0x27, 16, 2);
MFRC522 rfid(2, 0);
WiFiClientSecure clientSecure;
HTTPClient http;

const unsigned int buzzer = 15;
const int pushButton = 16;

const String secretKey = "09KOb6arkLbPBihp";
const String deviceId = "98a6ab06-c118-488d-8674-0bdea4e4ccce";

// ====== SETUP WIFI MANAGER ======
void wifiConnection() {
  Serial.begin(9600);
  WiFiManager wifiManager;

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Config WiFi...");
  lcd.setCursor(0, 1);
  lcd.print("Tunggu sebentar");

  wifiManager.autoConnect("Presensi_RFID");

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WiFi Terhubung!");
  lcd.setCursor(0, 1);
  lcd.print(WiFi.localIP());
  delay(2000);
}

// ====== SETUP LCD ======
void setLcd() {
  lcd.begin(16, 2);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(2, 0);
  lcd.print("APLIKASI WEB");
  lcd.setCursor(1, 1);
  lcd.print("PRESENSI RFID.");
  delay(2000);
  lcd.clear();
  lcd.setCursor(1, 0);
  lcd.print("SILAKAN TEMPEL");
  lcd.setCursor(0, 1);
  lcd.print("KARTU RFID ANDA.");
}

// ====== SETUP ======
void setup() {
  wifiConnection();
  setLcd();
  SPI.begin();
  rfid.PCD_Init();
  pinMode(pushButton, INPUT_PULLUP);
  pinMode(buzzer, OUTPUT);

  clientSecure.setInsecure(); // ⚠️ skip sertifikat SSL (cukup untuk testing)
}

// ====== LOOP ======
void loop() {
  deviceMode();

  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  String idTag = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    idTag += String(rfid.uid.uidByte[i]);
  }

  Serial.println(idTag);
  storePresence(idTag);

  delay(1000);
  lcd.clear();
  lcd.setCursor(1, 0);
  lcd.print("SILAKAN TEMPEL");
  lcd.setCursor(0, 1);
  lcd.print("KARTU RFID ANDA.");
}

// ====== SUARA ======
void toneSuccess() {
  tone(buzzer, 2000);
  delay(200);
  noTone(buzzer);
}

void toneFailed() {
  tone(buzzer, 2000); delay(100);
  tone(buzzer, 1000); delay(100);
  tone(buzzer, 2000); delay(200);
  noTone(buzzer);
}

// ====== GANTI MODE DEVICE ======
void deviceMode() {
  if (digitalRead(pushButton) == LOW) return; // tombol tidak ditekan
  while (digitalRead(pushButton) == HIGH); // debounce

  String url = "https://" + String(host) + "/api/devices/mode?secret_key=" + secretKey + "&device_id=" + deviceId;
  http.begin(clientSecure, url);

  int httpCode = http.GET();
  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println(payload);

    if (payload == "SECRET_KEY_NOT_FOUND") {
      toneFailed();
      lcd.clear();
      lcd.print("SECRET KEY ERR");
    } else if (payload == "DEVICE_NOT_FOUND") {
      toneFailed();
      lcd.clear();
      lcd.print("DEVICE NOT FOUND");
    } else if (payload == "CARD_ADD_MODE") {
      toneSuccess();
      lcd.clear();
      lcd.setCursor(2, 0);
      lcd.print("ADD CARD MODE");
    } else if (payload == "READER_MODE") {
      toneSuccess();
      lcd.clear();
      lcd.setCursor(2, 0);
      lcd.print("READER MODE");
    } else {
      toneFailed();
      lcd.clear();
      lcd.print("UNKNOWN RESP");
    }
  } else {
    Serial.printf("Mode Change Error: %s\n", http.errorToString(httpCode).c_str());
    toneFailed();
    lcd.clear();
    lcd.print("NETWORK ERROR");
  }
  http.end();
  delay(500);
}

// ====== PROSES PRESENSI ======
void storePresence(String rfid) {
  String url = "https://" + String(host) + "/api/devices/presence?secret_key=" + secretKey + "&device_id=" + deviceId + "&rfid=" + rfid;
  http.begin(clientSecure, url);

  int httpCode = http.GET();
  if (httpCode > 0) {
    String payload = http.getString();
    Serial.printf("[HTTP] code: %d\n", httpCode);
    Serial.println(payload);

    if (payload == "RFID_ADDED") {
      lcd.clear();
      lcd.print("KARTU DITAMBAH!");
      toneSuccess();
    } 
    else if (payload == "RFID_REGISTERED") {
      lcd.clear();
      lcd.print("SUDAH TERDAFTAR");
      toneFailed();
    } 
    else if (payload == "RFID_NOT_FOUND") {
      lcd.clear();
      lcd.print("RFID TDK DITEMU");
      toneFailed();
    } 
    else if (payload == "STUDENT_NOT_FOUND") {
      lcd.clear();
      lcd.print("SISWA TDK ADA");
      toneFailed();
    } 
    else if (payload == "PRESENCE_CLOCK_IN_SAVED") {
      lcd.clear();
      lcd.print("CLOCK IN OK");
      toneSuccess();
    } 
    else if (payload == "PRESENCE_CLOCK_OUT_SAVED") {
      lcd.clear();
      lcd.print("CLOCK OUT OK");
      toneSuccess();
    } 
    else if (payload == "ALREADY_CLOCKED_IN") {
      lcd.clear();
      lcd.print("SUDAH ABSEN");
      toneFailed();
    } 
    else if (payload == "SECRET_KEY_NOT_FOUND") {
      lcd.clear();
      lcd.print("KEY INVALID");
      toneFailed();
    } 
    else if (payload == "DEVICE_NOT_FOUND") {
      lcd.clear();
      lcd.print("DEVICE INVALID");
      toneFailed();
    } 
    else {
      lcd.clear();
      lcd.print("RESP UNKNOWN");
      toneFailed();
    }
  } 
  else {
    Serial.printf("[HTTP] failed: %s\n", http.errorToString(httpCode).c_str());
    lcd.clear();
    lcd.print("NETWORK FAIL");
    toneFailed();
  }

  http.end();
  delay(500);
}
