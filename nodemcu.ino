#include <ESP8266WiFi.h>
#include <LiquidCrystal_I2C.h>
#include <MFRC522.h>
#include <WiFiManager.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <SPI.h>

// ==========================
// Konfigurasi utama
// ==========================
const char *host = "presensismk.prestasiprima.sch.id"; // domain baru
const int httpsPort = 443;

LiquidCrystal_I2C lcd = LiquidCrystal_I2C(0x27, 16, 2);
MFRC522 rfid(2, 0);
WiFiClientSecure clientSecure;
HTTPClient http;

const unsigned int buzzer = 15; // D8
const int pushButton = 16;      // D0 (sesuaikan wiring alatmu)
const String secretKey = "09KOb6arkLbPBihp";
const String deviceId = "cc8b6c8a-3960-47df-a4a3-f0167b01c8df"; // device kamu


// ==========================
// WiFi Setup
// ==========================
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

  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());
  delay(2000);
}

// ==========================
// LCD Setup
// ==========================
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

// ==========================
// Setup Utama
// ==========================
void setup() {
  wifiConnection();
  setLcd();
  SPI.begin();
  rfid.PCD_Init();
  pinMode(pushButton, OUTPUT);
  pinMode(buzzer, OUTPUT);

  clientSecure.setInsecure(); // skip SSL cert (aman untuk testing)
}


// ==========================
// Loop Utama
// ==========================
void loop() {
  deviceMode();

  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  String idTag = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    idTag += rfid.uid.uidByte[i];
  }

  Serial.println("RFID: " + idTag);
  storePresence(idTag);

  delay(1000);
  lcd.clear();
  lcd.setCursor(1, 0);
  lcd.print("SILAKAN TEMPEL");
  lcd.setCursor(0, 1);
  lcd.print("KARTU RFID ANDA.");
}


// ==========================
// Bunyi
// ==========================
void toneSuccess() {
  tone(buzzer, 2000);
  delay(500);
  noTone(buzzer);
}

void toneFailed() {
  tone(buzzer, 2000); delay(100);
  tone(buzzer, 1000); delay(100);
  tone(buzzer, 2000); delay(200);
  noTone(buzzer);
}


// ==========================
// Ganti Mode Device
// ==========================
void deviceMode() {
  if (digitalRead(pushButton) == 1) {
    while (digitalRead(pushButton) == 1); // tunggu sampai dilepas

    String url = "https://" + String(host) + "/api/lms/devices/mode?device_id=" + deviceId;
    http.begin(clientSecure, url);

    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
      String payload = http.getString();

      Serial.printf("[HTTP] code: %d\n", httpResponseCode);
      Serial.println("MODE RESPONSE: " + payload);

      if (payload == "DEVICE_NOT_FOUND") {
        toneFailed();
        lcd.clear();
        lcd.setCursor(3, 0);
        lcd.print("DEVICE-ID");
        lcd.setCursor(2, 1);
        lcd.print("TIDAK DITEMUKAN");
      } 
      else if (payload == "READER_MODE") {
        toneSuccess();
        lcd.clear();
        lcd.setCursor(1, 0);
        lcd.print("DEVICE CHANGED");
        lcd.setCursor(2, 1);
        lcd.print("READER MODE.");
      } 
      else if (payload == "CARD_ADD_MODE") {
        toneSuccess();
        lcd.clear();
        lcd.setCursor(1, 0);
        lcd.print("DEVICE CHANGED");
        lcd.setCursor(2, 1);
        lcd.print("ADD CARD MODE.");
      } 
      else {
        toneFailed();
        lcd.clear();
        lcd.setCursor(2, 0);
        lcd.print("RESP UNKNOWN");
        lcd.setCursor(1, 1);
        lcd.print(payload);
      }
    } 
    else {
      toneFailed();
      Serial.printf("[HTTP] failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
      lcd.clear();
      lcd.setCursor(3, 0);
      lcd.print("NETWORK ERR");
      lcd.setCursor(2, 1);
      lcd.print("MODE FAILED");
    }

    http.end();
  }
}


// ==========================
// Proses Presensi
// ==========================
void storePresence(String rfid) {
  String url = "https://" + String(host) + "/api/lms/presences/store?rfid=" + rfid + "&device_id=" + deviceId;
  http.begin(clientSecure, url);

  int httpResponseCode = http.GET();
  if (httpResponseCode > 0) {
    String payload = http.getString();
    Serial.printf("[HTTP] code: %d\n", httpResponseCode);
    Serial.println(payload);

    if (payload == "RFID_ADDED") {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("KARTU BARU SUKSES");
      lcd.setCursor(2, 1);
      lcd.print("DIDAFTARKAN");
      toneSuccess();
    } 
    else if (payload == "RFID_REGISTERED") {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("KARTU SUDAH");
      lcd.setCursor(3, 1);
      lcd.print("TERDAFTAR");
      toneFailed();
    }
    else if (payload == "PRESENCE_CLOCK_IN_SAVED") {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("ABSEN MASUK OK");
      lcd.setCursor(2, 1);
      lcd.print("SELAMAT BELAJAR");
      toneSuccess();
    } 
    else if (payload == "PRESENCE_CLOCK_OUT_SAVED") {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("ABSEN PULANG OK");
      lcd.setCursor(1, 1);
      lcd.print("HATI-HATI DI JLN");
      toneSuccess();
    } 
    else if (payload == "STUDENT_NOT_FOUND") {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("SISWA TDK ADA");
      lcd.setCursor(2, 1);
      lcd.print("DI DATABASE");
      toneFailed();
    } 
    else if (payload == "RFID_NOT_FOUND") {
      lcd.clear();
      lcd.setCursor(3, 0);
      lcd.print("RFID TIDAK");
      lcd.setCursor(2, 1);
      lcd.print("TERDAFTAR");
      toneFailed();
    } 
    else if (payload == "ALREADY_CLOCKED_IN") {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("SUDAH ABSEN");
      lcd.setCursor(2, 1);
      lcd.print("SEBELUMNYA");
      toneFailed();
    } 
    else {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("RESP UNKNOWN");
      lcd.setCursor(2, 1);
      lcd.print(payload);
      toneFailed();
    }
  } 
  else {
    toneFailed();
    Serial.printf("[HTTP] failed: %s\n", http.errorToString(httpResponseCode).c_str());
    lcd.clear();
    lcd.setCursor(3, 0);
    lcd.print("NETWORK ERR");
    lcd.setCursor(2, 1);
    lcd.print("PRES FAIL");
  }

  http.end();
}
