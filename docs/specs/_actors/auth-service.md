---
id: ACT-AUTH
title: Authentication service
summary: Checks email and password and keeps the Editor session.
kind: system
---

# Authentication service

## Role
Verifies Editor credentials and keeps the session on the device.

## Used by
- ADM-ACCESS — sign-in, sign-out, session check
- ADM-PUBLISH — the publish service accepts only callers with a valid session
