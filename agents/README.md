# Agents workflow

This folder is the instruction queue for this project.

## How it works

1. You drop a new instruction as a markdown file in `instructions/`, one at a time (e.g. `instructions/0001-add-login.md`).
2. Claude reads it, implements it, and:
   - Appends an entry to [`CHANGELOG.md`](CHANGELOG.md) describing what was done.
   - Updates [`FEATURES.md`](FEATURES.md) with the feature's status (done / in progress / pending) and any open follow-ups.
3. If you later ask to change or extend something already implemented, Claude updates the original feature entry in `FEATURES.md` and adds a new dated `CHANGELOG.md` entry for the change — it does not silently rewrite history.

## Conventions

- Instruction files are numbered in the order they're given: `0001-*.md`, `0002-*.md`, ...
- Nothing here is executed automatically — Claude only acts on an instruction file when you explicitly say to.
