---
id: ACT-SONGS-DB
title: Songs database
summary: Stores songs; read at build time for the public site and live by the admin area.
kind: system
---

# Songs database

## Role
Single store of songs. The public site reads it when it is rebuilt; the admin area reads and writes it directly.

## Used by
- CAT-SEARCH, CAT-VIEW — read, as of the last publish
- ADM-EDIT — read and write, live
