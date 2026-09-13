import { useEffect } from "react";
import type { ChartCalculation, BodyName } from "@/lib/astrology/types";
import { BODY_GLYPHS, ZODIAC_GLYPHS, ZODIAC_SIGNS, ELEMENT_OF } from "@/lib/astrology/types";
import { normalizeDeg } from "@/lib/astrology/zodiac";
import { supabase } from "@/integrations/supabase/client";

interface Props { chart: ChartCalculation; size?: number; }

const ELEMENT_COLOR: Record<string, string> = {
  Fire: "oklch(0.65 0.20 30)", Earth: "oklch(0.55 0.12 130)", Air: "oklch(0.75 0.13 220)", Water: "oklch(0.55 0.14 260)",
};
const ASPECT_STROKE: Record<string, string> = { Conjunction:"oklch(0.85 0.15 85)", Opposition:"oklch(0.65 0.22 25)", Square:"oklch(0.62 0.20 30)", Trine:"oklch(0.7 0.18 195)", Sextile:"oklch(0.7 0.15 145)" };
const MAJOR = new Set(["Conjunction","Opposition","Square","Trine","Sextile"]);
const VISIBLE_BODIES: BodyName[] = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto","Chiron","North Node"];

export function ChartWheel({ chart, size = 560 }: Props) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user || user.user.is_anonymous || cancelled) return;
        await (supabase as any).from("natal_charts").upsert({
          user_id: user.user.id, name: chart.input.name, birth_date: chart.input.date,
          birth_time: chart.input.time, birth_place: chart.input.place, chart_data: chart,
          calculated_at: chart.engine.calculatedAt, updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      } catch (error) { console.warn("[chart] dashboard save failed", error); }
    })();
    return () => { cancelled = true; };
  }, [chart]);

  const cx = size / 2, cy = size / 2;
  const rOuter = size * 0.48, rZodiacInner = size * 0.40, rHouseInner = size * 0.30, rPlanet = size * 0.345, rAspectInner = size * 0.295;
  const timeUnknown = chart.input.timeUnknown === true;
  const asc = timeUnknown ? 0 : chart.ascendant;
  const toAngle = (lon: number) => normalizeDeg(180 - (lon - asc));
  const polar = (angleDeg: number, r: number) => { const a = (angleDeg * Math.PI) / 180; return [cx + r * Math.cos(a), cy - r * Math.sin(a)] as const; };
  const placed: { name: BodyName; angle: number; lon: number }[] = [];
  const bodyList = chart.bodies.filter((b) => VISIBLE_BODIES.includes(b.name));
  const sortedByLon = [...bodyList].sort((a, b) => a.longitude - b.longitude);
  let lastAngle = -1000;
  for (const b of sortedByLon) { let angle = toAngle(b.longitude); if (Math.abs(angle - lastAngle) < 7) angle = lastAngle + 7; placed.push({ name: b.name, angle, lon: b.longitude }); lastAngle = angle; }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      <defs><radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="oklch(0.20 0.06 280)"/><stop offset="100%" stopColor="oklch(0.12 0.04 280)"/></radialGradient></defs>
      <circle cx={cx} cy={cy} r={rOuter} fill="url(#bg)" stroke="oklch(0.82 0.15 85 / 0.5)" strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={rZodiacInner} fill="none" stroke="oklch(0.82 0.15 85 / 0.3)"/><circle cx={cx} cy={cy} r={rHouseInner} fill="none" stroke="oklch(0.82 0.15 85 / 0.25)"/><circle cx={cx} cy={cy} r={rAspectInner} fill="none" stroke="oklch(0.82 0.15 85 / 0.18)"/>
      {ZODIAC_SIGNS.map((sign, i) => { const startLon=i*30,startA=toAngle(startLon),midA=toAngle(startLon+15),[x1,y1]=polar(startA,rOuter),[x2,y2]=polar(startA,rZodiacInner),[tx,ty]=polar(midA,(rOuter+rZodiacInner)/2); return <g key={sign}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.82 0.15 85 / 0.4)" strokeWidth={1}/><text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize={size*0.04} fill={ELEMENT_COLOR[ELEMENT_OF[sign]]} fontWeight={600}>{ZODIAC_GLYPHS[sign]}</text></g>; })}
      {(timeUnknown?[]:chart.houses).map((cusp,i)=>{const a=toAngle(cusp),[x1,y1]=polar(a,rZodiacInner),[x2,y2]=polar(a,rHouseInner),isAngular=i===0||i===3||i===6||i===9,[lx,ly]=polar(toAngle(cusp+3),rHouseInner-12);return <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isAngular?"var(--gold)":"oklch(0.82 0.15 85 / 0.35)"} strokeWidth={isAngular?1.5:.75}/><text x={lx} y={ly} fontSize={size*.022} fill="oklch(0.75 0.04 80)" textAnchor="middle">{i+1}</text></g>})}
      {chart.aspects.filter(a=>MAJOR.has(a.type)).map((asp,i)=>{const a=chart.bodies.find(b=>b.name===asp.a),b=chart.bodies.find(x=>x.name===asp.b);if(!a||!b||!VISIBLE_BODIES.includes(a.name)||!VISIBLE_BODIES.includes(b.name))return null;const[x1,y1]=polar(toAngle(a.longitude),rAspectInner),[x2,y2]=polar(toAngle(b.longitude),rAspectInner),opacity=Math.max(.18,.6-asp.orb/12);return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ASPECT_STROKE[asp.type]??"oklch(0.7 0 0)"} strokeWidth={.9} opacity={opacity}/>})}
      {placed.map((p)=>{const[px,py]=polar(p.angle,rPlanet),[tx,ty]=polar(p.angle,rZodiacInner-14),body=chart.bodies.find(b=>b.name===p.name)!;return <g key={p.name}><line x1={polar(toAngle(p.lon),rZodiacInner)[0]} y1={polar(toAngle(p.lon),rZodiacInner)[1]} x2={tx} y2={ty} stroke="oklch(0.82 0.15 85 / 0.35)" strokeWidth={.5}/><circle cx={px} cy={py} r={size*.022} fill="oklch(0.18 0.045 278)" stroke="var(--gold)" strokeWidth={1}/><text x={px} y={py} textAnchor="middle" dominantBaseline="middle" fontSize={size*.028} fill="oklch(0.95 0.05 80)">{BODY_GLYPHS[p.name]}</text>{body.retrograde&&<text x={px+12} y={py+4} fontSize={size*.018} fill="oklch(0.7 0.16 30)">℞</text>}</g>})}
      {(timeUnknown?[]:["Ascendant","Midheaven"] as BodyName[]).map(n=>{const b=chart.bodies.find(x=>x.name===n);if(!b)return null;const a=toAngle(b.longitude),[x1,y1]=polar(a,rOuter),[x2,y2]=polar(a,rOuter+18);return <g key={n}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--gold)" strokeWidth={2}/><text x={x2} y={y2-2} fontSize={size*.025} fill="var(--gold)" textAnchor="middle">{n==="Ascendant"?"ASC":"MC"}</text></g>})}
    </svg>
  );
}
