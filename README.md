# Interieur

Een plattegrondplanner in de browser om kamers op schaal in te richten. Geschreven in gewone HTML en JavaScript, zonder buildstap.

## Wat het kan

- **Kamers tekenen**: rechthoek, L- of U-vorm, muren verslepen, uitbouwen en inhammen, of een foto of PDF van een plattegrond overtrekken.
- **Ramen, deuren en vaste punten**: radiatoren, stopcontacten, tv-aansluiting, lichtpunten, kolommen en schuine wanden.
- **Inrichten**: meubels slepen, draaien en van formaat veranderen, met controle op looproutes (80 cm), overlap, deur-draaicirkels en radiatoren.
- **Varianten** per kamer naast elkaar vergelijken.
- **Lichtplan** met lampen, lichtcirkels en grove lux-schattingen.
- **Wandaanzicht** voor kunst, planken, gordijnen en wandlampen op hoogte.
- **3D-weergave** (isometrisch).
- **Budget en winkellijst** met export naar CSV, en de plattegrond als PNG.
- **Ongedaan maken**, zoomen en schuiven, meetlint.

Alle standaardmaten, lumenwaarden en lux-berekeningen zijn schattingen.

## Bestanden

| Bestand | Inhoud |
|---|---|
| `plattegrond.html` | De pagina en de stijl van de planner |
| `planner.js` | Alle logica van de planner |
| `intake.html` | Een invulformulier per kamer (eerdere versie, optioneel) |

## Lokaal draaien

Start een eenvoudige webserver in deze map:

```
python -m http.server 5173 --bind 127.0.0.1
```

Open daarna http://localhost:5173/plattegrond.html.

Lokaal wordt er niets opgeslagen. Opslaan, de onderlaag uploaden, downloaden en de adviesknop gebruiken de runtime van Claude-artifacts (`window.claude`). Zonder die runtime werkt alles behalve die functies.
