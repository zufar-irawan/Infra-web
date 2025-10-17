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
// LCD Helper
// ==========================
void showLcd(const String &line1, const String &line2 = "") {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(line1);
  lcd.setCursor(0, 1);
  if (!line2.isEmpty()) {
    lcd.print(line2);
  } else {
    lcd.print("                ");
  }
}


// ==========================
// WiFi Setup
// ==========================
void wifiConnection() {
  Serial.begin(9600);
  WiFiManager wifiManager;

  showLcd("Menyambung Wi-Fi", "Mohon tunggu...");

  wifiManager.autoConnect("Presensi_RFID");

  showLcd("Wi-Fi terhubung", WiFi.localIP().toString());

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
  showLcd("Sistem presensi", "RFID sekolah");
  delay(2000);
  showLcd("Silakan tempel", "Kartu RFID Anda");
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
  showLcd("Silakan tempel", "Kartu RFID Anda");
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
        showLcd("Perangkat", "Tidak ditemukan");
      } 
      else if (payload == "READER_MODE") {
        toneSuccess();
        showLcd("Mode perangkat", "Reader aktif");
      } 
      else if (payload == "CARD_ADD_MODE") {
        toneSuccess();
        showLcd("Mode perangkat", "Tambah kartu");
      } 
      else {
        toneFailed();
  showLcd("Respons tidak", "Dikenal");
      }
    } 
    else {
      toneFailed();
      Serial.printf("[HTTP] failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
  showLcd("Koneksi gagal", "Mode gagal");
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
  showLcd("Registrasi kartu", "Berhasil");
      toneSuccess();
    } 
    else if (payload == "RFID_REGISTERED") {
  showLcd("Kartu terdaftar", "Sudah terdaftar");
      toneFailed();
    }
    else if (payload == "PRESENCE_CLOCK_IN_SAVED") {
      showLcd("Absen masuk", "Selamat belajar");
      toneSuccess();
    } 
    else if (payload == "PRESENCE_CLOCK_OUT_SAVED") {
  showLcd("Absen pulang", "Hati-hati pulang");
      toneSuccess();
    } 
    else if (payload == "STUDENT_NOT_FOUND") {
      showLcd("Data siswa", "Tidak ditemukan");
      toneFailed();
    } 
    else if (payload == "RFID_NOT_FOUND") {
      showLcd("Kartu RFID", "Tidak ditemukan");
      toneFailed();
    } 
    else if (payload == "ALREADY_CLOCKED_IN") {
      showLcd("Siswa sudah", "Melakukan absen");
      toneFailed();
    } 
    else {
  showLcd("Respons tidak", "Dikenal");
      toneFailed();
    }
  } 
  else {
    toneFailed();
    Serial.printf("[HTTP] failed: %s\n", http.errorToString(httpResponseCode).c_str());
    showLcd("Koneksi gagal", "Silakan ulangi");
  }

  http.end();
}
