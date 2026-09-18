# Small Web

MongoDB should be running locally first.

## Server

```
cd server
npm install
copy .env.example .env
npm run seed
npm run start:dev
```

## Web

```
cd web
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000
