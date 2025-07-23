-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- Posts policies
CREATE POLICY "Anyone can view posts" ON posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON posts
    FOR INSERT TO authenticated
    WITH CHECK (
        CASE 
            WHEN category = 'notice' THEN 
                EXISTS (SELECT 1 FROM profiles WHERE id = author_id AND role = 'admin')
            ELSE 
                true
        END
    );

CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE TO authenticated
    USING ((select auth.uid()) = (SELECT user_id FROM profiles WHERE id = author_id));

CREATE POLICY "Users can delete own posts" ON posts
    FOR DELETE TO authenticated
    USING ((select auth.uid()) = (SELECT user_id FROM profiles WHERE id = author_id));

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE TO authenticated
    USING ((select auth.uid()) = (SELECT user_id FROM profiles WHERE id = author_id));

CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE TO authenticated
    USING ((select auth.uid()) = (SELECT user_id FROM profiles WHERE id = author_id));

-- Files policies
CREATE POLICY "Anyone can view files" ON files
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload files" ON files
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can delete own files" ON files
    FOR DELETE TO authenticated
    USING ((select auth.uid()) = (SELECT user_id FROM profiles WHERE id = uploaded_by));

-- Events policies
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Only admins can create events" ON events
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND role = 'admin')
    );

CREATE POLICY "Only admins can update events" ON events
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND role = 'admin')
    );

CREATE POLICY "Only admins can delete events" ON events
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND role = 'admin')
    );

-- Organization policies
CREATE POLICY "Anyone can view organization" ON organization
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage organization" ON organization
    FOR ALL TO authenticated
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND role = 'admin')
    );