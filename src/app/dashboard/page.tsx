import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/data/services";
import { Container, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id, course: { published: true } },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  const enrolledIds = new Set(enrollments.map(({ course }) => course.id));
  const recommended = await prisma.course.findMany({
    where: { published: true, id: { notIn: [...enrolledIds] } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">Dashboard</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Welcome{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
            </h1>
            {session.user.email && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{session.user.email}</p>}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Your enrolled courses</h2>
          </div>

          {enrollments.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              You have not enrolled in a course yet. Explore the available courses below.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {enrollments.map(({ course }) => (
                <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">{course.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{course.description}</p>
                  <Link href={`/services/${course.slug}`} className="mt-4 inline-flex items-center text-sm font-bold text-brand-700 dark:text-brand-300">
                    View course <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">Explore other courses</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((course) => (
              <article key={course.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">{course.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{course.description}</p>
                <p className="mt-3 text-sm font-extrabold text-brand-700 dark:text-brand-300">{formatINR(course.price)}</p>
                <Link href={`/services/${course.slug}`} className="mt-4 inline-flex items-center text-sm font-bold text-brand-700 dark:text-brand-300">
                  Explore <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
