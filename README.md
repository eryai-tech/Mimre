# Mimre 🌿

**Din digitale samtalevenn** - En AI-samtalsapp for personer med demens.

## Om Mimre

Mimre er en varm og omsorgsfull samtale-app designet for personer med demens. Appen bruker forskningsbaserte kommunikasjonsteknikker som reminiscens-terapi og validerings-terapi for å gi meningsfulle samtaler.

### Samtalepartnere

- **Astrid** 👵 - En varm, omsorgsfull kvinne på 75 år som elsker å snakke om gamle dager, baking og familie.
- **Ivar** 👴 - En blid, jovial mann på 78 år som liker å fortelle historier om arbeid, fiske og fotball.

## Teknologi

- **Frontend**: Next.js 14 (App Router)
- **Backend**: EryAI Engine (multi-tenant AI-motor)
- **AI**: Google Gemini 2.0 Flash
- **Database**: Supabase

## Kom i gang

### Utvikling

```bash
# Installer avhengigheter
npm install

# Start utviklingsserver
npm run dev
```

### Miljøvariabler

Kopier `.env.example` til `.env.local`:

```bash
cp .env.example .env.local
```

## PWA

Mimre er en Progressive Web App (PWA) som kan installeres på mobil:

1. Åpne appen i nettleseren
2. Trykk på "Legg til på startskjerm" (iOS) eller "Installer" (Android)
3. Appen fungerer nå som en vanlig app

## Sikkerhet

Mimre har innebygde sikkerhetsfunksjoner:

- **Alert-ord**: Systemet varsler pårørende/helsepersonell ved bekymringsfulle ord (smerte, angst, etc.)
- **Rate limiting**: Beskyttelse mot misbruk
- **RLS**: Row Level Security i databasen

## Lisens

Proprietær - EryAI © 2026
