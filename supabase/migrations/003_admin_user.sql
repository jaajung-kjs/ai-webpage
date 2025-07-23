-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user(
    user_email VARCHAR(255),
    user_password VARCHAR(255),
    user_name VARCHAR(255),
    user_department VARCHAR(255),
    user_position VARCHAR(255)
)
RETURNS void AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- This function should be run manually with proper credentials
    -- Example usage:
    -- SELECT create_admin_user('admin@aiclub.com', 'securepassword123', '관리자', 'AI연구부', '부장');
    
    -- Note: User creation must be done through Supabase Auth
    -- After creating the user through Auth, update their profile role:
    
    -- UPDATE profiles 
    -- SET role = 'admin' 
    -- WHERE email = 'admin@aiclub.com';
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example: Update existing user to admin (run this after creating user through Auth)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';