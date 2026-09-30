export type Vacancy = { id: string; title: string; vesselType: string; experience: string; joining: string; duration: string; flag?: string; certificates: string; salary?: string; posted: string; closing: string; status: "Open" | "Closed" };
// Only genuine, authorised vacancies. Add here (or connect to the admin/CMS). Expired ones are hidden and excluded from JobPosting schema.
export const vacancies: Vacancy[] = [];
