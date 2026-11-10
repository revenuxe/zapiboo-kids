-- Separate operational notes from customer-readable requests, and make uploads private.
BEGIN;

CREATE TABLE IF NOT EXISTS public.admin_lead_notes (
  lead_id uuid PRIMARY KEY REFERENCES public.leads(id) ON DELETE CASCADE,
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 5000),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_lead_notes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_lead_notes FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_lead_notes TO authenticated;
CREATE POLICY "Only admins manage operational notes" ON public.admin_lead_notes
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Query notes contain the original customer's enquiry and must remain intact.
INSERT INTO public.admin_lead_notes (lead_id, notes)
SELECT id, notes FROM public.leads
WHERE lead_type IS DISTINCT FROM 'query' AND vehicle_type <> 'query' AND notes IS NOT NULL
ON CONFLICT (lead_id) DO NOTHING;
UPDATE public.leads SET notes = NULL
WHERE lead_type IS DISTINCT FROM 'query' AND vehicle_type <> 'query' AND notes IS NOT NULL;

CREATE POLICY "Admins can read seller profiles" ON public.user_profiles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Preserve the request's ownership and operational fields when a customer cancels.
CREATE OR REPLACE FUNCTION public.guard_customer_lead_write()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() = 'service_role' OR (auth.role() IS NULL AND session_user IN ('postgres', 'supabase_admin')) THEN RETURN NEW; END IF;
  IF public.has_role(auth.uid(), 'admin') THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.user_id := auth.uid();
    NEW.status := 'new';
    IF NEW.lead_type IS DISTINCT FROM 'query' AND NEW.vehicle_type <> 'query' THEN
      NEW.notes := NULL;
    END IF;
    RETURN NEW;
  END IF;
  IF auth.uid() IS NULL OR OLD.user_id IS DISTINCT FROM auth.uid()
    OR OLD.status NOT IN ('new','contacted','scheduled') OR NEW.status <> 'cancelled'
    OR (to_jsonb(NEW) - 'status' - 'updated_at') IS DISTINCT FROM (to_jsonb(OLD) - 'status' - 'updated_at')
  THEN RAISE EXCEPTION 'Only cancellation of your own pending request is permitted' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_customer_lead_write() FROM PUBLIC;
CREATE TRIGGER guard_customer_lead_write BEFORE INSERT OR UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.guard_customer_lead_write();
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;

CREATE OR REPLACE FUNCTION public.admin_update_lead(p_lead_id uuid, p_status text, p_notes text)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;
  IF p_status NOT IN ('new','contacted','scheduled','done','cancelled') OR p_status IS NULL THEN
    RAISE EXCEPTION 'Invalid pickup status';
  END IF;
  IF char_length(coalesce(p_notes,'')) > 5000 THEN RAISE EXCEPTION 'Notes exceed 5000 characters'; END IF;
  UPDATE public.leads SET status = p_status WHERE id = p_lead_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  INSERT INTO public.admin_lead_notes(lead_id, notes, updated_at)
  VALUES (p_lead_id, coalesce(p_notes,''), now())
  ON CONFLICT (lead_id) DO UPDATE SET notes = EXCLUDED.notes, updated_at = EXCLUDED.updated_at;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_update_lead(uuid,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_lead(uuid,text,text) TO authenticated;

UPDATE storage.buckets SET public = false WHERE id = 'pickup-photos';
DROP POLICY IF EXISTS "Anyone can view pickup photos" ON storage.objects;
CREATE POLICY "Owners and admins read pickup photos" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'pickup-photos' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));
NOTIFY pgrst, 'reload schema';
COMMIT;
