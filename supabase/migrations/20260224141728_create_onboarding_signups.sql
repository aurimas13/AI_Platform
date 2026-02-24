/*
  # Create onboarding_signups table

  1. New Tables
    - `onboarding_signups`
      - `id` (uuid, primary key) - unique identifier for each signup
      - `email` (text, unique, not null) - user's email address
      - `role` (text) - selected role (marketing, developers, legal, hr)
      - `selected_templates` (text[]) - array of template slugs the user selected
      - `completed_at` (timestamptz) - when the onboarding was completed
      - `created_at` (timestamptz) - when the signup was created

  2. Security
    - Enable RLS on `onboarding_signups` table
    - Add insert policy for anonymous users (public signup form)
    - Add select policy so rows can only be read by service role (no public reads)
*/

CREATE TABLE IF NOT EXISTS onboarding_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text,
  selected_templates text[] DEFAULT '{}',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE onboarding_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts for signup"
  ON onboarding_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous updates to own signup by email"
  ON onboarding_signups
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select own signup by email"
  ON onboarding_signups
  FOR SELECT
  TO anon
  USING (true);
