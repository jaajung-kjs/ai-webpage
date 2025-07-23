-- Add email_verified column to profiles
ALTER TABLE profiles 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Update existing profiles based on auth.users email_confirmed_at
UPDATE profiles p
SET email_verified = TRUE
FROM auth.users u
WHERE p.user_id = u.id
AND u.email_confirmed_at IS NOT NULL;

-- Update the handle_new_user function to check email verification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create profile if email is verified
    IF new.email_confirmed_at IS NOT NULL THEN
        INSERT INTO public.profiles (user_id, email, name, email_verified, department, position)
        VALUES (
            new.id, 
            new.email, 
            COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
            TRUE,
            new.raw_user_meta_data->>'department',
            new.raw_user_meta_data->>'position'
        );
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to handle email confirmation
CREATE OR REPLACE FUNCTION public.handle_email_confirmed()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if profile exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = new.id) THEN
        -- Create profile when email is confirmed
        INSERT INTO public.profiles (user_id, email, name, email_verified, department, position)
        VALUES (
            new.id, 
            new.email, 
            COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
            TRUE,
            new.raw_user_meta_data->>'department',
            new.raw_user_meta_data->>'position'
        );
    ELSE
        -- Update existing profile
        UPDATE public.profiles
        SET email_verified = TRUE
        WHERE user_id = new.id;
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email confirmation
CREATE TRIGGER on_email_confirmed
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW
    WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.handle_email_confirmed();