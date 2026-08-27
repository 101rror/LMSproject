import { CourseCard } from '@/components/courses/course-card';
import { PageHeader } from '@/components/ui/page-header';
import { courses } from '@/lib/api/data';
export default function MyCoursesPage() { return <div><PageHeader eyebrow="Your library" title="My courses" description="The ideas you are currently making your own." /><div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{courses.slice(0, 3).map((course, i) => <CourseCard key={course.id} course={{ ...course, progress: [42, 18, 76][i] }} enrolled />)}</div></div> }
