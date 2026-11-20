# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are English learners (children, teens, adults), including learners with disabilities (*ذوي الهمم* / people of determination), plus parents/guardians and inclusive English teachers.

## Product Purpose

Wattly connects learners with the right English teachers and provides accessible live lessons, structured courses, and AI-assisted practice so every lesson fits the learner.

## Positioning

Inclusion is built into the core product (accessible classroom + support profiles + teacher matching), not added later. AI assists teachers and learners; it never replaces the human teacher.

## Operating Context

Learner journey: Sign up → goals + optional supports → placement → matched teachers → trial lesson → live learning + AI practice → progress tracking.

## Capabilities and Constraints

- Roles: learner, parent, teacher, admin
- Appwrite backend (Auth + TablesDB database `wattly`)
- Interface languages: English, French, Spanish (Arabic RTL planned)
- Core accessibility supports are always free
- AI never diagnoses; stores supports, not medical labels
- Deploy target: Cloudflare Worker named `wattly` (OpenNext)
- Demo access account for prototype testing (`demo@wattly.app`)

## Brand Commitments

- Name: Wattly
- Tagline: Speak English with confidence — from your very first A to fluent Z.
- Colors: Wattly Blue `#0016BD`, Midnight `#000A5E`, Sunshine `#FFC933`, Coral `#FF5C5C`, Sky `#8FA8FF`
- Logo: custom script wordmark; white on blue, blue on light
- Type: Poppins for UI text

## Evidence on Hand

- Brand pack: `../Wattly_Logo_Pack`
- Concept specification provided in chat (prototype MVP document)
- No real testimonials or live teacher inventory yet — sample teachers used in prototype screens

## Product Principles

1. Inclusion by design
2. Human first — AI assists
3. Choice and control for learners/guardians
4. Privacy for support preferences
5. Measure real learning progress

## Accessibility & Inclusion

Target WCAG 2.2 AA. Optional support profiles (captions, TTS, dyslexia mode, reduce motion, speak-optional, symbols). Keyboard and screen-reader friendly flows.
