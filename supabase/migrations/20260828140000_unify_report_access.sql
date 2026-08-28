DO $$ BEGIN CREATE TYPE public.report_access_mode AS ENUM ('free', 'paid', 'admin-only'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
ALTER TABLE public.report_catalog ADD COLUMN IF NOT EXISTS access_mode public.report_access_mode;
ALTER TABLE public.report_catalog ADD COLUMN IF NOT EXISTS requires_partner boolean NOT NULL DEFAULT false;
ALTER TABLE public.report_catalog ADD COLUMN IF NOT EXISTS report_version integer NOT NULL DEFAULT 1 CHECK (report_version > 0);
UPDATE public.report_catalog SET access_mode = CASE WHEN COALESCE(sale_price_cents, price_cents, 0) = 0 THEN 'free'::public.report_access_mode ELSE 'paid'::public.report_access_mode END WHERE access_mode IS NULL;
ALTER TABLE public.report_catalog ALTER COLUMN access_mode SET NOT NULL;
ALTER TABLE public.report_catalog ALTER COLUMN access_mode SET DEFAULT 'paid';
UPDATE public.report_catalog SET requires_partner = true WHERE category = 'Synastry' OR id LIKE 'synastry-%';

INSERT INTO public.report_catalog (id,title,category,price_cents,access_mode,is_active,requires_partner,report_version,short_description,icon,sort_order)
VALUES
('synastry-compatibility','Synastry Compatibility Blueprint','Synastry',7900,'paid',true,true,1,'Complete two-chart compatibility analysis.','∞',1000),
('synastry-love-chemistry','Love & Chemistry Synastry','Synastry',6900,'paid',true,true,1,'Romantic attraction and chemistry between two charts.','♀',1010),
('synastry-composite','Composite Relationship Chart','Synastry',8900,'paid',true,true,1,'The shared relationship chart and its purpose.','◉',1020),
('synastry-karmic-ties','Karmic Ties & Soul Contracts','Synastry',8900,'paid',true,true,1,'Karmic contacts and evolutionary themes.','☊',1030),
('synastry-communication','Communication & Conflict Synastry','Synastry',5900,'paid',true,true,1,'Communication styles, friction, and repair.','☿',1040),
('synastry-longevity','Long-Term Potential & Marriage','Synastry',9900,'paid',true,true,1,'Commitment, durability, and long-term potential.','♄',1050),
('synastry-friendship','Friendship & Ally Synastry','Synastry',4900,'paid',true,true,1,'Friendship compatibility and mutual support.','✦',1060),
('synastry-business','Business Partnership Synastry','Synastry',8900,'paid',true,true,1,'Business compatibility, roles, and shared goals.','♃',1070),
('synastry-family','Family & Parent-Child Synastry','Synastry',6900,'paid',true,true,1,'Family dynamics and parent-child understanding.','⌂',1080),
('synastry-bedroom','Bedroom Chemistry Synastry','Synastry',9900,'paid',true,true,1,'Adult intimacy and sexual compatibility.','♂',1090),
('synastry-strengths-challenges','Relationship Strengths & Challenges','Synastry',6900,'paid',true,true,1,'Shared strengths, pressure points, and repair strategies.','◆',1100),
('synastry-emotional','Emotional Compatibility','Synastry',6900,'paid',true,true,1,'Emotional needs, safety, and responsiveness.','☽',1110),
('synastry-spiritual','Spiritual Connection','Synastry',7900,'paid',true,true,1,'Spiritual resonance and shared growth.','♆',1120),
('synastry-complete','Complete Relationship Blueprint','Synastry',14900,'paid',true,true,1,'The complete relationship masterwork.','✧',1130)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,category=EXCLUDED.category,requires_partner=true,report_version=GREATEST(public.report_catalog.report_version,1);
