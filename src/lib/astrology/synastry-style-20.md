# Cosmic Blueprint — 20 Synastry Report Styles

This implementation adds 20 deterministic style renderers downstream of the canonical synastry engine. It does not calculate astrology and never substitutes invented chart data.

## Styles
1. Short Summary
2. Detailed Sectioned Report
3. Compatibility Score Card
4. Element & Modality Breakdown
5. Planetary Aspects Focus
6. House Overlay Focus
7. Emotional Core Deep Dive
8. Communication Analysis
9. Romance & Attraction
10. Challenges & Growth
11. Relationship Development
12. Poetic Archetypal Narrative
13. Two-Voice Dialogue
14. Top 5 Insights
15. Quick Tips
16. Tarot-Crossover Metaphor
17. Cinematic Scenes
18. Couple Horoscope Feed
19. Analytical Relationship Report
20. Lighthearted Report

## Integration
Use `buildSynastryStyleInput(chartA, chartB)` to adapt the application's canonical Swiss-Ephemeris charts, then `generateSynastryStyle(styleId, input)` or `generateAllSynastryStyles(input)`. `buildSynastryStylePromptModule` can provide a deterministic style skeleton to the existing LLM layer.

House-dependent output automatically becomes a limitation notice when either birth time is unknown. Static synastry is not treated as a timing forecast; the development/feed styles explicitly avoid fabricating transits or progressions.
