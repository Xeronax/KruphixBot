# Kruphix Bot

KruphixBot is a Discord bot that fetches and displays information about Magic: The Gathering cards.

## Features

- Fetch card information from the Scryfall API.
- Display card details in a user-friendly format.
- Navigate through multiple cards using buttons.
- Display full card images.
- Dual-image display for double-faced cards
- Display rulings

## Commands

- `/help`: Lists all of Kruphix Bot's features.
- `/card <query>`: Fetches a card with the specified name or Scryfall syntax and displays its details.
- `/cr <rule>`: Fetches a rule by number. (Ex. '704', '104.1', '601.3a').
- `/art <query>`: Displays a full cropped image of a card's art and the artist.
- `/price <query>`: Displays pricing information for a card

## Getting Started

You can add Kruphix Bot to your server by clicking [here](https://discord.com/api/oauth2/authorize?client_id=1099066463236673626&permissions=277025778752&scope=applications.commands%20bot)

## Graphing & Charting [**Beta**]

Kruphix Bot is now able to create charts displaying information over large swathes of MTG data using [Scryfall Syntax](https://scryfall.com/docs/syntax). Currently, it only supports Scatter charts with a least squares regression best fit line.

To start creating charts or graphs, use `/graph <Chart Type Here> <Independent Variables Here> <Insert Constant Variables Here><Normalize? (True/False)>`

- Chart Type: Currently only accepts `Scatter`, but will soon support `Bar`, `Bubble`, `Pie`, etc.
- Independent Variables: Scryfall syntax here is the data that you want to plot. Separate multiple independent variables with a semicolon and you may use brackets to indicate names. (ex. `[3 Mana Creatures] t:creature mv=3; [2 Mana Creatures] t:creature mv=2`
- Constants: Scryfall syntax here will be blanket applied to each independent variable, mostly saves keystrokes (ex. The aforementinoed chart could also be generated using `<[3 Mana Creatures] mv=3; [2 Mana Creatures] mv=2> <t:creature>`
- Normalize?: This is a true/false value. True by default, it will append some generally useful syntax to the end of each independent variable: *"is:firstprinting -is:reprint -is:extra -is:promo -is:oversized game:paper (st:core or st:expansion)"* You can enter false for this variable and create the same effect manually using Constants.

## Feedback

If you encounter any issues or have any suggestions for improvements, please open an issue on this GitHub repository, do `/feedback`, or message xeronax on Discord.

## Planned Features

- Fuzzy searches
- Search suggestions
- What's in standard

## License

This project is licensed under the MIT License.

