# 🚗 Car Care - Frontend UI
<p align="center">
  <img src="car-care/src/assets/favicon.png" alt="App logo"/>
</p>

Ez a repository tartalmazza a Car Care webalkalmazás frontend kódját. A felület egy modern, egyoldalas alkalmazás amely gyors és interaktív felhasználói élményt biztosít a járművek, szervizesemények és alkatrészek kezeléséhez.

A frontend szorosan együttműködik a különálló Django backend API-val, éles környezetben pedig Nginx webszerver szolgálja ki Docker konténerből.

## Használt Technológiák
* **Alaprendszer:** React.js
* **Építőeszköz (Bundler):** Vite 
* **Hálózati kérések:** Axios (Beállított interceptorokkal a Token kezeléshez)
* **Útválasztás (Routing):** Wouter
* **Éles kiszolgálás:** Nginx
* **Konténerizáció:** Docker
* **CI/CD:** GitHub Actions (Self-hosted runner)

## Architektúra és Hálózat
Éles környezetben az alkalmazás lefordított (buildelt) statikus fájljait egy  Nginx konténer szolgálja ki. A rendszer a backenddel közös Docker hálózaton (`car_care_net`) osztozik.

A Cloudflare Tunnel forgalomirányítása miatt **nincs szükség bonyolult CORS beállításokra**:
* A felhasználó megnyitja a `shitbox.hu` oldalt ➡️ A Cloudflare a Frontend (Nginx) konténernek adja a kérést.
* A React kód a háttérben kérést küld az `/api/vehicles/` címre ➡️ A Cloudflare ezt automatikusan a Backend (Django) konténernek továbbítja.

## Fejlesztői (Lokális) Környezet Beállítása

Ha a saját gépeden szeretnéd módosítani a kódot (Docker nélkül):

1. **Klónozd a repót:**
   > git clone [https://github.com/orkevili/car-care-frontend.git](https://github.com/orkevili/car-care-frontend.git)
   cd `saját repo`

2. **Telepítsd a függőségeket:**
    > npm install

3. **Lokális fejlesztői szerver indítása:**
    > npm run dev    
    - Megjegyzés: A vite.config.js fájlban be van állítva egy proxy, így a lokális fejlesztés során a /api kérések automatikusan a helyi Django szerverre (pl. localhost:8000) irányítódnak, elkerülve a CORS hibákat.

## 🐳 Élesítés Dockerrel

1. **A konténer felépítése és indítása:**
    > docker compose up -d --build

2. **Nginx útválasztás**
    > A projekt tartalmaz egy egyedi nginx.conf fájlt. Ez biztosítja, hogy ha a felhasználó közvetlenül egy aloldalra (pl. /vehicles) frissít rá, az Nginx ne 404-es hibát adjon, hanem töltse be az index.html-t, átadva az irányítást a React Routernek.

## Autentikáció és API Kommunikáció

A frontend a backenddel Token alapú hitelesítéssel kommunikál.

- Sikeres bejelentkezéskor a szerver által adott Access Token a böngésző localStorage memóriájába kerül.

- Az Api.jsx fájlban található Axios példány egy "Interceptor" segítségével automatikusan minden további kérés fejlécébe beilleszti ezt a tokent.

- Bármilyen API kérés a relatív `/api/` útvonalra megy, így a domaintől függetlenül működik.

## CI/CD - Automatikus Deploy

A kód karbantartását egy GitHub Actions folyamat (`.github/workflows/deploy.yml`) automatizálja.
Amikor új kódot pusholsz a `main` ágra:

1. A szervereden futó Self-hosted Runner érzékeli a változást.

2. Letölti a friss kódot.

3. Újraépíti az Nginx konténert a legújabb React builddel.

4. Lecseréli a futó konténert anélkül, hogy a backend működését megzavarná.