import { notFound } from "next/navigation";
import { LessonView } from "@/components/lesson-view";
import { course, getLesson, getModule, neighbours } from "@/content/course";

export function generateStaticParams() {
  return course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ moduleId: m.id, slug: l.slug })),
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; slug: string }>;
}) {
  const { moduleId, slug } = await params;
  const mod = getModule(moduleId);
  const lesson = getLesson(moduleId, slug);
  if (!mod || !lesson) notFound();

  const { prev, next } = neighbours(moduleId, slug);

  return (
    <LessonView
      module={mod}
      lesson={lesson}
      prev={
        prev
          ? { moduleId: prev.module.id, slug: prev.lesson.slug, title: prev.lesson.title }
          : undefined
      }
      next={
        next
          ? { moduleId: next.module.id, slug: next.lesson.slug, title: next.lesson.title }
          : undefined
      }
    />
  );
}
