# Entity Relationship Diagram (Text Form)

## Entities and Attributes

### 1. profiles
- id (Primary Key)
- first_name
- last_name
- email
- avatar_url
- phone
- bio
- company
- position
- created_at
- updated_at

### 2. user_roles
- id (Primary Key)
- user_id (Foreign Key to profiles.id)
- role (ENUM: user, admin, technician, sales, ceo, manager)
- specialty
- created_at

### 3. service_requests
- id (Primary Key)
- user_id (Foreign Key to profiles.id)
- assigned_technician_id (Foreign Key to profiles.id)
- title
- description
- job_type
- priority
- status
- location
- estimated_duration
- required_specialty
- scheduled_date
- completed_at
- created_at
- updated_at

### 4. assets
- id (Primary Key)
- user_id (Foreign Key to profiles.id)
- name
- asset_type
- manufacturer
- model
- serial_number
- purchase_date
- warranty_expires
- status
- location
- specifications (JSON)
- image_url
- cpu
- ram
- storage
- graphics_card
- screen_size
- operating_system
- network_ports
- power_supply
- other_specs
- created_at
- updated_at

### 5. activity_logs
- id (Primary Key)
- user_id (Foreign Key to profiles.id)
- action
- description
- entity_type
- entity_id
- metadata (JSON)
- created_at

### 6. notifications
- id (Primary Key)
- user_id (Foreign Key to profiles.id)
- title
- message
- type
- read
- created_at

## Relationships

1. **profiles** 1:N **user_roles**
   - One profile can have multiple roles
   - user_roles.user_id references profiles.id

2. **profiles** 1:N **service_requests** (as user)
   - One user can create multiple service requests
   - service_requests.user_id references profiles.id

3. **profiles** 1:N **service_requests** (as technician)
   - One technician can be assigned to multiple service requests
   - service_requests.assigned_technician_id references profiles.id

4. **profiles** 1:N **assets**
   - One user can own multiple assets
   - assets.user_id references profiles.id

5. **profiles** 1:N **activity_logs**
   - One user can have multiple activity logs
   - activity_logs.user_id references profiles.id

6. **profiles** 1:N **notifications**
   - One user can have multiple notifications
   - notifications.user_id references profiles.id

## Relationship Cardinalities

- profiles (1) ---- (N) user_roles
- profiles (1) ---- (N) service_requests (created)
- profiles (1) ---- (N) service_requests (assigned)
- profiles (1) ---- (N) assets
- profiles (1) ---- (N) activity_logs
- profiles (1) ---- (N) notifications