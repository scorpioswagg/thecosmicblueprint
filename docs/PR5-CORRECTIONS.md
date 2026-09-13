# PR #5 corrections

The chart wheel is intentionally presentation-only. It must not write `natal_charts` as a side effect of rendering, because `/demo` and other consumers can render charts that are not the signed-in user's actual natal chart.

Natal-chart persistence belongs in the authenticated chart-calculation flow. Report delivery must persist the generated report before sending the ready email and must use expiring, server-authorized download tokens.