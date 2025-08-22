-- Insert mock profiles for testing
INSERT INTO public.profiles (id, first_name, last_name, email, phone, company, position) VALUES
  ('01234567-89ab-cdef-0123-456789abcdef', 'John', 'Doe', 'john.doe@techcorp.com', '+234-801-234-5678', 'TechCorp Ltd', 'IT Manager'),
  ('11234567-89ab-cdef-0123-456789abcdef', 'Jane', 'Smith', 'jane.smith@biznet.com', '+234-802-345-6789', 'BizNet Solutions', 'System Administrator'),
  ('21234567-89ab-cdef-0123-456789abcdef', 'Mike', 'Johnson', 'mike.johnson@repairs.com', '+234-803-456-7890', 'Quick Repairs Inc', 'Hardware Technician'),
  ('31234567-89ab-cdef-0123-456789abcdef', 'Sarah', 'Wilson', 'sarah.wilson@netflow.com', '+234-804-567-8901', 'NetFlow Systems', 'Network Specialist'),
  ('41234567-89ab-cdef-0123-456789abcdef', 'David', 'Brown', 'david.brown@admin.com', '+234-805-678-9012', 'TechFlow Admin', 'Administrator');

-- Insert user roles for the mock users
INSERT INTO public.user_roles (user_id, role, specialty) VALUES
  ('01234567-89ab-cdef-0123-456789abcdef', 'user', null),
  ('11234567-89ab-cdef-0123-456789abcdef', 'user', null),
  ('21234567-89ab-cdef-0123-456789abcdef', 'technician', 'hardware'),
  ('31234567-89ab-cdef-0123-456789abcdef', 'technician', 'network'),
  ('41234567-89ab-cdef-0123-456789abcdef', 'admin', null);

-- Insert mock service requests
INSERT INTO public.service_requests (
  id,
  user_id, 
  title, 
  description, 
  job_type, 
  priority, 
  status, 
  location, 
  estimated_duration,
  required_specialty,
  assigned_technician_id,
  created_at
) VALUES
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcdef', 'Laptop Screen Flickering', 'Dell laptop screen flickering intermittently, affecting work productivity', 'hardware_repair', 'high', 'in_progress', 'Office Floor 3, Desk 15', '2 hours', 'hardware', '21234567-89ab-cdef-0123-456789abcdef', now() - interval '2 days'),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcdef', 'Software Installation Request', 'Need Adobe Creative Suite installed on workstation', 'software_installation', 'medium', 'completed', 'Office Floor 2, Desk 8', '1 hour', 'software', null, now() - interval '5 days'),
  (gen_random_uuid(), '11234567-89ab-cdef-0123-456789abcdef', 'Network Connectivity Issues', 'Unable to connect to company VPN from remote location', 'network_setup', 'urgent', 'assigned', 'Remote - Home Office', '3 hours', 'network', '31234567-89ab-cdef-0123-456789abcdef', now() - interval '1 day'),
  (gen_random_uuid(), '11234567-89ab-cdef-0123-456789abcdef', 'Printer Maintenance', 'Office printer jamming frequently and print quality degrading', 'maintenance', 'low', 'pending', 'Office Floor 1, Print Room', '1.5 hours', 'hardware', null, now() - interval '3 hours'),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcdef', 'System Upgrade Request', 'Upgrade RAM from 8GB to 16GB for better performance', 'upgrade', 'medium', 'pending', 'Office Floor 3, Desk 15', '2 hours', 'hardware', null, now() - interval '6 hours');

-- Insert mock activity logs
INSERT INTO public.activity_logs (user_id, action, description, entity_type, entity_id) VALUES
  ('01234567-89ab-cdef-0123-456789abcdef', 'create_request', 'Created service request: Laptop Screen Flickering', 'service_request', (SELECT id FROM service_requests WHERE title = 'Laptop Screen Flickering')),
  ('21234567-89ab-cdef-0123-456789abcdef', 'assigned_request', 'Request assigned', 'service_request', (SELECT id FROM service_requests WHERE title = 'Laptop Screen Flickering')),
  ('01234567-89ab-cdef-0123-456789abcdef', 'create_request', 'Created service request: Software Installation Request', 'service_request', (SELECT id FROM service_requests WHERE title = 'Software Installation Request')),
  ('11234567-89ab-cdef-0123-456789abcdef', 'create_request', 'Created service request: Network Connectivity Issues', 'service_request', (SELECT id FROM service_requests WHERE title = 'Network Connectivity Issues')),
  ('31234567-89ab-cdef-0123-456789abcdef', 'assigned_request', 'Request assigned', 'service_request', (SELECT id FROM service_requests WHERE title = 'Network Connectivity Issues'));

-- Insert mock assets for users
INSERT INTO public.assets (
  id,
  user_id,
  name,
  asset_type,
  manufacturer,
  model,
  serial_number,
  status,
  location,
  purchase_date,
  warranty_expires,
  cpu,
  ram,
  storage,
  operating_system,
  screen_size,
  created_at
) VALUES
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcdef', 'John Work Laptop', 'laptop', 'Dell', 'Latitude 7420', 'DL7420-001', 'active', 'Office Floor 3, Desk 15', '2023-01-15', '2026-01-15', 'Intel Core i7-1165G7', '16GB DDR4', '512GB SSD', 'Windows 11 Pro', '14 inch', now() - interval '400 days'),
  (gen_random_uuid(), '01234567-89ab-cdef-0123-456789abcdef', 'John Workstation', 'desktop', 'HP', 'EliteDesk 800 G8', 'HP800-002', 'active', 'Office Floor 3, Desk 15', '2023-03-20', '2026-03-20', 'Intel Core i5-11500', '32GB DDR4', '1TB SSD', 'Windows 11 Pro', null, now() - interval '330 days'),
  (gen_random_uuid(), '11234567-89ab-cdef-0123-456789abcdef', 'Jane Mobile Device', 'tablet', 'Apple', 'iPad Pro', 'APL-IPP-003', 'active', 'Remote - Home Office', '2023-06-10', '2024-06-10', 'Apple M2', '8GB', '256GB', 'iPadOS 16', '12.9 inch', now() - interval '250 days'),
  (gen_random_uuid(), '11234567-89ab-cdef-0123-456789abcdef', 'Jane Network Router', 'network_equipment', 'Cisco', 'ISR 4331', 'CSC-4331-004', 'active', 'Office Server Room', '2022-11-05', '2025-11-05', null, null, null, 'Cisco IOS XE', null, now() - interval '470 days');

-- Update currency display function for Naira
CREATE OR REPLACE FUNCTION format_currency(amount NUMERIC)
RETURNS TEXT AS $$
BEGIN
    RETURN '₦' || to_char(amount, 'FM999,999,999.00');
END;
$$ LANGUAGE plpgsql;