# SHD Builds

Фанатский сайт билдов The Division 2 в стиле интерфейса ИСХ (ISAC / SHD).

## Страницы

| Файл | Что внутри |
|---|---|
| `index.html` | Главная: избранный билд и разделы |
| `build-striker.html` | Билд Striker DPS: сводка, снаряжение с модалками «где выбить», режимы и тайминги, разбор синергии и симулятор стаков |
| `gear.html` | База брендов и зелёных комплектов с фильтрами по типу бонуса и источнику |
| `ui-kit.html` | Дизайн-система: палитра, карточки, кнопки, типографика |
| `assets/shd.js` | Общие токены Tailwind, компоненты и навигация |

## Стек

Статичный HTML, [Tailwind Play CDN](https://tailwindcss.com/docs/installation/play-cdn) и [Alpine.js](https://alpinejs.dev). Сборка не нужна.

Локальный запуск:

```bash
python -m http.server 8000
```

## Данные

Значения бонусов, таланты и источники дропа — демонстрационные, сверяйте с актуальным патчем. Данные лежат в объектах `STRIKER_BUILD` (`build-striker.html`) и `GEAR` (`gear.html`).

Проект не связан с Ubisoft. The Division — торговая марка Ubisoft Entertainment.
