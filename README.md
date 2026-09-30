# Contact Form Automation App

Prosty formularz kontaktowy podzielony na dwa projekty:

- **frontend/** – Vite + React + TypeScript + Tailwind CSS
- **backend/** – Express + TypeScript (wysyłka wiadomości na webhook)

## Wymagania

- Node.js 20+ (testowane na 24)
- npm 10+

## Instalacja

Rezultat poniższego polecenia to dwa foldery `node_modules` — jeden w `frontend/`, drugi w `backend/`.

```bash
npm run install:all
```

## Uruchomienie

Frontend i backend muszą działać równolegle, w dwóch terminalach.

Terminal 1 — backend (Express, port **3000**):

```bash
npm run dev:backend
```

Terminal 2 — frontend (Vite, port **5173**):

```bash
npm run dev:frontend
```

Formularz jest dostępny pod **http://localhost:5173**.

Alternatywnie, bez skryptów z katalogu głównego:

```bash
cd backend  && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Build i typy

```bash
npm run typecheck   # TypeScript w obu projektach
npm run build       # frontend/dist + backend/dist
```

## Struktura

```
frontend/
  src/
    api/contact.ts            # fetch do backendu
    components/
      ContactForm.tsx         # 5 pól + walidacja + submit
      FormElement.tsx         # jeden komponent odpowiedzialny za wygląd pola
      Header.tsx
    types/contact.ts          # typy wspólne z backendem
backend/
  src/
    config.ts                 # port, CORS, adres webhooka
    index.ts                  # konfiguracja Expressa
    routes/contact.ts         # POST /api/contact
    services/webhook.ts       # wysyłka na webhook (fetch zakomentowany)
    validation/contact.ts     # walidacja po stronie serwera
    types.ts
```

## API

| Metoda | Ścieżka            | Opis                          |
| ------ | ------------------ | ----------------------------- |
| `GET`  | `/api/health`      | healthcheck zwraca `200`      |
| `POST` | `/api/contact`     | przyjmuje i waliduje wiadomość |

Przykładowe body `POST /api/contact`:

```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "phone": "+48 123 456 789",
  "email": "jan@example.com",
  "message": "Dzień dobry, mam pytanie…"
}
```

Odpowiedź poprawna (`200`):

```json
{ "ok": true, "message": "Dziękujemy za wiadomość!" }
```

Odpowiedź z błędami walidacji (`400`) — klucz `errors` mapuje nazwę pola na komunikat:

```json
{
  "ok": false,
  "message": "Formularz zawiera błędy.",
  "errors": { "email": "Adres e-mail wygląda na niepoprawny." }
}
```

Błąd dostarczenia na webhook (`502`):

```json
{ "ok": false, "message": "Nie udało się dostarczyć wiadomości: …" }
```

## Webhook

Adres webhooka jest wpisany wprost w kodzie, w `backend/src/config.ts`:

```ts
webhook: {
  url: 'https://example.com/webhooks/contact-form',
  token: '',
}
```

Wywołanie `fetch` w `backend/src/services/webhook.ts` jest **zakomentowane**. Dopóki tak zostanie, funkcja loguje przygotowaną wiadomość do konsoli i udaje dostarczenie, żeby dało się przetestować cały formularz (frontend dostaje `200` i pokazuje podziękowanie).

Aby włączyć realną wysyłkę:
1. Podmień `url` (i `token`, jeśli webhook wymaga nagłówka `Authorization`).
2. Odkomentuj blok `fetch` w `backend/src/services/webhook.ts` i usuń sekcję tymczasowego logowania.

## Sekrety

W kodzie nie ma żadnych sekretów ani plików `.env` — adresy są wpisane normalnie, żeby łatwo było je podmienić. Przed wdrożeniem produkcyjnym warto przenieść `webhook.url`, `webhook.token` i listę `corsOrigins` do zmiennych środowiskowych.

## Testy

Pola formularza mają atrybut `data-testid` z nazwą pola, więc łatwo je odwoływać w testach:

| Selektor                        | Element           |
| ------------------------------- | ----------------- |
| `[data-testid=contact-form]`    | `<form>`          |
| `[data-testid=firstName]`       | input             |
| `[data-testid=lastName]`        | input             |
| `[data-testid=phone]`           | input             |
| `[data-testid=email]`           | input             |
| `[data-testid=message]`         | `<textarea>`      |
| `[data-testid=firstName-error]` | komunikat błędu   |
| `[data-testid=submit-button]`   | przycisk wysyłki  |
| `[data-testid=form-feedback]`   | status / komunikat wyniku |

Warto zauważyć: `FormElement` to jedyny komponent odpowiedzialny za wygląd pola (input i textarea). Dodanie kolejnego pola sprowadza się do jednego wywołania — wygląd, walidacja i komunikaty błędów są wtedy identyczne jak w pozostałych polach:

```tsx
<FormElement
  name="company"
  label="Firma"
  value={values.company}
  onChange={(value) => handleChange('company', value)}
  error={errors.company}
/>
```
