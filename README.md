```markdown id="q7f2n8"
# Procedural Binaural Wind

A real-time procedural wind synthesizer built with the Web Audio API.

The project creates a dynamic 3D/binaural wind environment using persistent synthesized noise sources, HRTF spatialization, procedural modulation, and interactive controls.

The goal is to create natural-feeling wind that behaves like an environmental sound field rather than a simple looping audio effect.

---

# Features

## Audio synthesis

- Web Audio API based synthesis
- Persistent wind sources
- HRTF binaural spatialization
- Eight directional wind positions:

```

```
      Front
```

Front Left     Front Right

Left              Right

Back Left      Back Right

```
       Back
```

```

- Multi-band wind processing:
  - Low pressure
  - Mid airflow
  - High turbulence

- Smooth parameter transitions
- Procedural turbulence
- Gust simulation
- Filter movement
- Flutter modulation
- Direction blending

---

# Controls

## Keyboard

### Start / Stop

```

SPACE

```

Starts or stops the wind engine.

---

## Direction

The wind direction can be controlled using:

```

```
    Q   W   E

    A       D

    Z   X   C
```

```

Mapping:

| Key | Direction |
|---|---|
| W | Front |
| Q | Front Left |
| A | Left |
| Z | Back Left |
| X | Back |
| C | Back Right |
| D | Right |
| E | Front Right |

Multiple keys can be held simultaneously.

Examples:

```

Q + W

```

creates a front-left wind field.

```

D + C

```

creates a right/back-right wind field.

---

## Intensity

Hold:

```

↑

```

Increase wind intensity.

Hold:

```

↓

```

Decrease wind intensity.

The controls behave like a slider rather than individual button presses.

---

## Gust

Press:

```

ENTER

```

Creates a gust using the current:

- direction
- intensity
- turbulence state

Gusts modify the existing wind field rather than creating new audio sources.

---

## Calm wind

Press:

```

S

```

The wind gradually fades into a low constant airflow.

---

# Touch Controls

The entire screen acts as a circular wind controller.

## Tap

Creates a gust.

## Drag

Controls:

- Direction = angle around the screen center
- Strength = distance from the center

```

Center
|
|
gentle airflow

Edge
|
|
strongest wind

```

The control radius is automatically scaled to the smaller screen dimension.

---

# Architecture

```

src/

├── main.js
│
├── AudioEngine.js
│
├── WindSource.js
│
├── WindField.js
│
├── GustEngine.js
│
├── Controls.js
│
├── TouchControls.js
│
├── HUD.js
│
└── Math.js

````

---

# Module Overview

## AudioEngine

Responsible for:

- AudioContext creation
- Noise generation
- Filters
- HRTF panning
- Audio routing

---

## WindSource

Represents one directional wind source.

Handles:

- gain changes
- filter movement
- turbulence
- flutter
- local gust energy

---

## WindField

Controls the complete wind environment.

Handles:

- global direction
- intensity
- directional blending
- simulation updates

---

## GustEngine

Creates:

- user gusts
- micro-gusts
- natural variation

---

## Controls

Handles:

- keyboard input
- direction selection
- intensity adjustment

---

## TouchControls

Provides:

- mobile interaction
- touch direction
- touch intensity
- gesture gusts

---

## HUD

Displays:

- wind direction
- angle
- intensity
- gust energy
- simulation values

---

# Running locally

Because the project uses ES modules, it should be served from a local web server.

Examples:

## Python

```bash
python -m http.server
````

Then open:

```
http://localhost:8000
```

---

## Node.js

Install a static server:

```bash
npm install -g serve
```

Run:

```bash
serve .
```

---

# Browser support

Requires a modern browser with:

* Web Audio API
* AudioContext
* PannerNode HRTF support
* ES modules
* Pointer Events

Recommended:

* Chrome
* Edge
* Firefox
* Safari

Headphones are recommended for the binaural effect.

---

# Project Goals

The long-term goal is a reusable environmental audio engine capable of producing:

* wind
* rain
* storms
* forests
* oceans
* atmospheric environments

using procedural synthesis rather than prerecorded loops.

---

# License

MIT License

---

# Credits

Built with:

* Web Audio API
* JavaScript ES Modules
* HRTF spatial audio
* Procedural synthesis techniques

```
```
