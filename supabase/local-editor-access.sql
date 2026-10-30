-- LOCAL ONLY. Production write policies are configured outside this repo (open question ADM-ACCESS Q2).
-- This grants signed-in users full access to songs so the admin area works against the local stack.
CREATE POLICY "Local: signed-in editors manage songs"
    ON songs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
