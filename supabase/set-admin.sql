-- jaajung@naver.com 계정을 관리자로 설정
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'jaajung@naver.com';