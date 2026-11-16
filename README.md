# Qorong'u Maktab II — Android 16:9 Local APK

Bu loyiha yuborilgan `qorongu-maktab.7z` manbasidan Android uchun tayyorlangan WebView ilovasidir.

## Nimalar o'zgardi

- Android ilovasi **landscape** rejimida ochiladi.
- WebView oynasi 16:9 nisbatda markazga joylanadi; 16:9 dan keng ekranlarda yonlarda qora maydon qoladi.
- Status bar va navigation bar yashiriladi; ilova to'liq ekran rejimida ishlaydi.
- HTML, JavaScript, Three.js va barcha o'yin fayllari APK ichidan yuklanadi.
- O'rnatilgan ilova internetga ulanmaydi: INTERNET ruxsati yo'q va WebView tarmoq yuklanishini bloklaydi.
- Reyting serverga yuborilmaydi, qurilmaning `localStorage` xotirasida saqlanadi.
- LAN/multiplayer menyusi Android local buildidan chiqarildi.
- Qurol va otish mexanikalari olib tashlandi; topishmoq, qochish, chiroq, muhit va survival jarayoni saqlangan.

## Talablar

- JDK 21
- Android SDK Platform 36
- Android SDK Build Tools 35.0.0
- Gradle 8.14 (yoki quyidagi `gradlew` bootstrap skripti orqali yuklanadi)

## Release APK yig'ish

**Linux / macOS / Termux muhitida:**

```bash
chmod +x gradlew
./gradlew :app:assembleRelease
```

**Windows:**

```bat
gradlew.bat :app:assembleRelease
```

Birinchi build vaqtida Gradle Three.js r128 faylini yuklab oladi va SHA-1 qiymatini tekshiradi. Bu — faqat build bosqichi uchun; APK o'rnatilgach o'yin lokal assetlardan ishlaydi.

APK chiqishi:

```text
app/build/outputs/apk/release/app-release-unsigned.apk
```

## GitHub Actions orqali Release APK

Loyihani GitHub repository'ga joylang. `Actions` ichidan **Build unsigned Android Release APK** workflow'ni `Run workflow` bilan ishga tushirish mumkin. `v1.0.0` kabi tag yuborilsa, workflow unsigned APK'ni GitHub Release fayli sifatida ham chiqaradi.

## Tekshiruv holati

Manba paketi JavaScript sintaksisi, XML resurslari, Android manifest sozlamalari, offline resurs havolalari va unsigned konfiguratsiya bo'yicha statik tekshirildi. Joriy ish muhitida Android SDK va Gradle o'rnatilmagani sababli APK bu yerda kompilyatsiya qilinmadi va qurilmada ishga tushirib sinovdan o'tkazilmadi. GitHub Actions workflow kompilyatsiyani bajarish uchun qo'shilgan.

## Imzolash haqida — muhim

Ushbu loyiha **keystore yaratmaydi va APK'ni imzolamaydi**. Natija `app-release-unsigned.apk` bo'ladi. Imzosiz APK odatiy Android o'rnatuvchisi tomonidan to'g'ridan-to'g'ri o'rnatilmaydi.

V1, V2 va V3 — APK imzolash sxemalari. Ularni haqiqiy tarzda yaratish uchun private signing key (odatda keystore ichida) shart. **Keystoresiz V1+V2+V3 imzosini qo'shib bo'lmaydi.** Shu sababli ushbu build unsigned bo'lib qoladi va V1/V2/V3 signature bloklari mavjud bo'lmaydi.

## Tuzilma

```text
QoronguMaktab-Android/
├── app/
│   ├── build.gradle
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/uz/ilhomvich/qorongumaktab/MainActivity.java
│       ├── res/
│       └── assets/game/
│           ├── index.html
│           ├── game.js
│           └── manifest.json
├── .github/workflows/release.yml
├── gradle/wrapper/gradle-wrapper.properties
├── gradlew
├── gradlew.bat
└── README.md
```
