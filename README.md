# SelectR

<p align="center">
  <img src="public/icons/icon128.svg" alt="SelectR Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Test and debug XPath & CSS selectors instantly</strong>
</p>

<p align="center">
  A Chrome extension for developers to test XPath and CSS selectors on any webpage with live highlighting and smart autocomplete.
</p>

---

## ✨ Features

- **Dual Mode** — Switch between XPath and CSS selector modes
- **Live Highlighting** — See matched elements highlighted in real-time as you type
- **Smart Autocomplete** — Get intelligent suggestions for XPath axes, functions, and CSS pseudo-selectors
- **Element Details** — View tag names, classes, IDs, and attributes of matched elements
- **Click to Navigate** — Click any result to scroll directly to that element
- **Hover to Focus** — Hover over results to temporarily highlight specific elements
- **Persistent Queries** — Your last query is saved and restored when you reopen the panel
- **Side Panel Integration** — Works in Chrome's side panel for a seamless development workflow

## 📦 Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/selectr.git
   cd selectr
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the extension:
   ```bash
   pnpm build
   ```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `dist` folder

## 🚀 Usage

1. Click the SelectR icon in your Chrome toolbar to open the side panel
2. Choose your selector mode (XPath or CSS)
3. Type your selector in the input field
4. Watch as matching elements are highlighted on the page
5. Click on any result to scroll to that element

### Example Selectors

**XPath:**
```
//div[@class='container']
//button[contains(text(), 'Submit')]
//input[@type='email']
```

**CSS:**
```css
div.container
button:contains('Submit')
input[type="email"]
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Start development build (with watch mode)
pnpm dev

# Production build
pnpm build
```

### Project Structure

```
src/
├── autocomplete/     # Autocomplete logic and suggestions
├── background/       # Service worker
├── content/          # Content script for page interaction
├── popup/            # React UI components
│   ├── components/   # Reusable components
│   └── App.tsx       # Main application
└── types/            # TypeScript type definitions
```

## 🧰 Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Vite** — Build tool
- **Chrome Extension Manifest V3** — Modern extension APIs

## 📄 License

MIT

---

<p align="center">
  Made with ☕ for developers who debug selectors
</p>

