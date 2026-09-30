# Frontend Roadmap

This document lists the pages and UI screens that should be created for the current backend APIs.

## 1. Job Management Pages

### 1.1 Jobs Dashboard Page
Purpose:
- Show all jobs in the system
- Search and filter jobs
- Open a job detail page
- Create a new job

Backend APIs used:
- GET /jobs/

Sections:
- Top bar with app title and navigation
- Search input
- Add Job button
- Job cards list
- Each job card shows:
  - job title
  - description preview
  - minimum score
  - minimum experience
  - required skills count
  - action buttons: View, Edit, Delete

Suggested route:
- /jobs

---

### 1.2 Create Job Page
Purpose:
- Add a new job requirement to the system

Backend APIs used:
- POST /jobs/

Fields:
- title
- description
- minimum_score
- minimum_experience
- required_skills
- optional_skills

UI sections:
- form title
- text inputs for details
- skill selection area
- save button
- cancel button

Suggested route:
- /jobs/new

---

### 1.3 Edit Job Page
Purpose:
- Update an existing job

Backend APIs used:
- GET /jobs/{job_id}
- PUT /jobs/{job_id}

UI sections:
- same form as create page
- prefilled values from selected job
- save changes button
- delete action optional

Suggested route:
- /jobs/:id/edit

---

### 1.4 Job Detail Page
Purpose:
- View the complete job information and linked skills

Backend APIs used:
- GET /jobs/{job_id}
- GET /jobs/{job_id}/skills

Sections:
- job title and description
- minimum score and experience
- required skills list
- optional skills list
- related actions:
  - Upload CVs
  - Edit job
  - Delete job

Suggested route:
- /jobs/:id

---

### 1.5 Job Skill Assignment Section
Purpose:
- Attach skills to a job

Backend APIs used:
- POST /jobs/{job_id}/skills
- DELETE /jobs/{job_id}/skills/{skill_id}

UI sections:
- skill dropdown or selection list
- add skill button
- list of assigned skills with remove button

This can be embedded inside the Create/Edit Job page or Job Detail page.

---

## 2. Skills Management Pages

### 2.1 Skills List Page
Purpose:
- View all skills in the system

Backend APIs used:
- GET /skills/

Sections:
- skill search box
- add skill button
- table or card list of skills

Suggested route:
- /skills

---

### 2.2 Add Skill Page
Purpose:
- Create a new skill record

Backend APIs used:
- POST /skills/

Fields:
- skill name
- optional description if available

Suggested route:
- /skills/new

---

### 2.3 Delete Skill Action
Purpose:
- Remove a skill from the catalog

Backend APIs used:
- DELETE /skills/{skill_id}

This action can be triggered from:
- Skills List Page
- Job Edit Page

---

## 3. Resume Analysis Pages

### 3.1 Upload Resume Page
Purpose:
- Select a job
- Upload one or multiple PDF resumes
- Send them for analysis

Backend APIs used:
- POST /resume/{job_id}

UI sections:
- job selector dropdown
- drag-and-drop upload area
- file list preview
- upload button
- validation message for PDF-only files
- max file size indicator

Suggested route:
- /resume/upload
- or /jobs/:id/resumes

---

### 3.2 Analysis Results Page
Purpose:
- Show the response after CV analysis is done

Backend APIs used:
- POST /resume/{job_id}

Sections:
- job title header
- summary statistics:
  - total files processed
  - completed count
  - failed count
- result cards for each uploaded resume
- each result includes:
  - filename
  - status
  - job title
  - analysis output
  - error text if failed

Suggested route:
- /jobs/:id/results
- or /resume/results

---

### 3.3 Export Excel Report Page
Purpose:
- Download the resume analysis report as Excel

Backend APIs used:
- GET /resume/export/{job_id}

UI sections:
- export button on Job Detail Page or Results Page
- download status
- file name preview

Suggested route:
- /jobs/:id/export

---

## 4. Candidate Pages

### 4.1 Candidate Profile / Details Page
Purpose:
- Show candidate information by ID

Backend APIs used:
- GET /candidate/{candidate_id}

Sections:
- candidate name
- email
- phone
- related analysis summary
- ability to view candidate full evaluation

Suggested route:
- /candidates/:id

---

## 5. Suggested App Navigation

Main navigation items:
- Dashboard
- Jobs
- Skills
- Resume Analysis
- Candidates

Sidebar structure example:
- Dashboard
- Jobs
  - All Jobs
  - New Job
- Skills
- Resume Upload
- Candidates

---

## 6. Recommended Minimum Frontend Build Order

### Phase 1: Core Job Flow
1. Jobs Dashboard
2. Create Job Page
3. Edit Job Page
4. Job Detail Page

### Phase 2: Skill Flow
5. Skills List Page
6. Add Skill Page

### Phase 3: Resume Analysis Flow
7. Upload Resume Page
8. Analysis Results Page
9. Excel Export Action

### Phase 4: Candidate View
10. Candidate Details Page

---

## 7. Best UI UX for this app

This app is a recruitment / resume screening system, so the frontend should feel like a simple HR dashboard.

Recommended design style:
- clean white background
- dark navy or blue accent colors
- cards for jobs and candidates
- progress badges for analysis status
- tables for skills and results
- strong emphasis on filtering and sorting

Best page behaviors:
- show success/error notifications after API calls
- small loading spinners while sending resume data
- form validation for required fields
- preview of uploaded PDF names before submission

---

## 8. Final Recommendation

If you want a small but complete frontend, build these 5 pages first:

1. Jobs Dashboard
2. Add/Edit Job Form
3. Job Detail Page
4. Resume Upload + Analysis Page
5. Analysis Results Page

These cover the main backend features and will make the project functional for real use.
