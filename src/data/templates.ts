import type { Role, Template, RoleOption } from '../types/onboarding';

export const roleOptions: RoleOption[] = [
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Campaigns, content, and audience insights',
    icon: 'Megaphone',
  },
  {
    id: 'developers',
    label: 'Developers',
    description: 'APIs, debugging, and automation',
    icon: 'Code2',
  },
  {
    id: 'legal',
    label: 'Legal',
    description: 'Contracts, compliance, and research',
    icon: 'Scale',
  },
  {
    id: 'hr',
    label: 'HR',
    description: 'Hiring, onboarding, and people ops',
    icon: 'Users',
  },
];

export const templatesByRole: Record<Role, Template[]> = {
  marketing: [
    {
      slug: 'seo-analyzer',
      name: 'SEO Analyzer',
      description: 'Audit pages for search performance and get actionable keyword recommendations.',
      icon: 'Search',
    },
    {
      slug: 'content-generator',
      name: 'Content Generator',
      description: 'Draft blog posts, ad copy, and social content tailored to your brand voice.',
      icon: 'PenTool',
    },
    {
      slug: 'campaign-optimizer',
      name: 'Campaign Optimizer',
      description: 'Analyze campaign metrics and surface high-impact optimizations in real time.',
      icon: 'TrendingUp',
    },
    {
      slug: 'audience-insights',
      name: 'Audience Insights',
      description: 'Segment audiences and uncover behavioral patterns from your analytics data.',
      icon: 'BarChart3',
    },
  ],
  developers: [
    {
      slug: 'api-debugger',
      name: 'API Debugger',
      description: 'Trace requests, inspect payloads, and diagnose endpoint failures instantly.',
      icon: 'Bug',
    },
    {
      slug: 'code-reviewer',
      name: 'Code Reviewer',
      description: 'Get AI-powered code reviews with security, performance, and style suggestions.',
      icon: 'GitPullRequest',
    },
    {
      slug: 'cicd-monitor',
      name: 'CI/CD Monitor',
      description: 'Track pipeline health, detect flaky tests, and monitor deployment status.',
      icon: 'Activity',
    },
    {
      slug: 'docs-generator',
      name: 'Docs Generator',
      description: 'Auto-generate API documentation and developer guides from your codebase.',
      icon: 'FileText',
    },
  ],
  legal: [
    {
      slug: 'contract-analyzer',
      name: 'Contract Analyzer',
      description: 'Extract key clauses, flag risks, and compare contract versions automatically.',
      icon: 'FileCheck',
    },
    {
      slug: 'compliance-checker',
      name: 'Compliance Checker',
      description: 'Scan documents against regulatory frameworks and surface compliance gaps.',
      icon: 'ShieldCheck',
    },
    {
      slug: 'ip-research',
      name: 'IP Research',
      description: 'Search patent databases and analyze intellectual property landscapes.',
      icon: 'Lightbulb',
    },
    {
      slug: 'regulatory-monitor',
      name: 'Regulatory Monitor',
      description: 'Track regulatory changes and receive alerts relevant to your jurisdiction.',
      icon: 'Bell',
    },
  ],
  hr: [
    {
      slug: 'resume-screener',
      name: 'Resume Screener',
      description: 'Score and rank candidates based on role requirements and culture fit signals.',
      icon: 'UserCheck',
    },
    {
      slug: 'employee-onboarder',
      name: 'Employee Onboarder',
      description: 'Generate personalized onboarding plans and automate first-week workflows.',
      icon: 'UserPlus',
    },
    {
      slug: 'policy-generator',
      name: 'Policy Generator',
      description: 'Draft and update HR policies aligned with current labor regulations.',
      icon: 'BookOpen',
    },
    {
      slug: 'sentiment-analyzer',
      name: 'Sentiment Analyzer',
      description: 'Analyze employee surveys and feedback to surface engagement trends.',
      icon: 'Heart',
    },
  ],
};
