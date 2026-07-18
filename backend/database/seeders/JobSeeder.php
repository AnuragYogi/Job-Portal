<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\JobListing;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        $techNova   = Company::where('name', 'TechNova Solutions')->first();
        $cloudBase  = Company::where('name', 'CloudBase Inc.')->first();

        $jobs = [
            [
                'company_id'  => $techNova->id,
                'title'       => 'Senior React Developer',
                'description' => "We are looking for an experienced React Developer to join our frontend team.\n\nResponsibilities:\n- Build and maintain high-quality React applications\n- Collaborate with designers and backend engineers\n- Write clean, testable code\n\nRequirements:\n- 3+ years of React experience\n- Strong knowledge of JavaScript/TypeScript\n- Experience with REST APIs and state management (Redux/Zustand)",
                'salary'      => '$90,000 - $120,000',
                'location'    => 'New York, NY',
                'type'        => 'full-time',
                'is_active'   => true,
            ],
            [
                'company_id'  => $techNova->id,
                'title'       => 'Laravel Backend Engineer',
                'description' => "Join our backend team to build scalable REST APIs and microservices.\n\nResponsibilities:\n- Design and develop Laravel APIs\n- Optimize database queries\n- Integrate third-party services\n\nRequirements:\n- 2+ years with Laravel\n- MySQL/PostgreSQL experience\n- Familiarity with JWT and OAuth",
                'salary'      => '$80,000 - $100,000',
                'location'    => 'Remote',
                'type'        => 'remote',
                'is_active'   => true,
            ],
            [
                'company_id'  => $techNova->id,
                'title'       => 'UI/UX Designer',
                'description' => "We need a creative UI/UX Designer to craft beautiful user experiences.\n\nResponsibilities:\n- Create wireframes, prototypes, and high-fidelity designs\n- Conduct user research and usability testing\n- Work closely with developers\n\nRequirements:\n- Proficiency in Figma or Adobe XD\n- Portfolio of web/mobile designs\n- Understanding of accessibility standards",
                'salary'      => '$70,000 - $90,000',
                'location'    => 'New York, NY',
                'type'        => 'full-time',
                'is_active'   => true,
            ],
            [
                'company_id'  => $cloudBase->id,
                'title'       => 'DevOps Engineer',
                'description' => "CloudBase is hiring a DevOps Engineer to manage our cloud infrastructure.\n\nResponsibilities:\n- Manage CI/CD pipelines\n- Monitor and optimize AWS/GCP infrastructure\n- Automate deployments with Terraform and Ansible\n\nRequirements:\n- 3+ years in DevOps or SRE roles\n- Strong knowledge of Docker and Kubernetes\n- Experience with cloud platforms (AWS/GCP/Azure)",
                'salary'      => '$100,000 - $130,000',
                'location'    => 'San Francisco, CA',
                'type'        => 'full-time',
                'is_active'   => true,
            ],
            [
                'company_id'  => $cloudBase->id,
                'title'       => 'Cloud Solutions Architect',
                'description' => "Design and implement cloud-native architectures for enterprise clients.\n\nResponsibilities:\n- Architect scalable cloud solutions\n- Lead technical discovery sessions with clients\n- Define best practices for cloud adoption\n\nRequirements:\n- 5+ years of cloud architecture experience\n- AWS/GCP certifications preferred\n- Strong communication skills",
                'salary'      => '$130,000 - $160,000',
                'location'    => 'San Francisco, CA',
                'type'        => 'contract',
                'is_active'   => true,
            ],
            [
                'company_id'  => $cloudBase->id,
                'title'       => 'Part-time Data Analyst',
                'description' => "Analyze business data and generate actionable insights for our clients.\n\nResponsibilities:\n- Build dashboards and reports\n- Perform SQL-based data analysis\n- Present findings to stakeholders\n\nRequirements:\n- Experience with SQL and Excel/Google Sheets\n- Familiarity with Tableau or Power BI\n- Strong analytical mindset",
                'salary'      => '$35/hr',
                'location'    => 'Remote',
                'type'        => 'part-time',
                'is_active'   => true,
            ],
        ];

        foreach ($jobs as $job) {
            JobListing::firstOrCreate(
                ['company_id' => $job['company_id'], 'title' => $job['title']],
                $job
            );
        }
    }
}
