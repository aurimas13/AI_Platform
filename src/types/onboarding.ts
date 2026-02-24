export type Role = 'marketing' | 'developers' | 'legal' | 'hr';

export type OnboardingStep = 'email' | 'role' | 'templates';

export interface Template {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface RoleOption {
  id: Role;
  label: string;
  description: string;
  icon: string;
}
