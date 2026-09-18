import { notFound } from "next/navigation";
import { ChallengeView } from "@/components/challenge-view";
import { course, getChallenge, getModule } from "@/content/course";

export function generateStaticParams() {
  return course.challenges.map((c) => ({ id: c.id }));
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = getChallenge(id);
  if (!challenge) notFound();

  return (
    <ChallengeView
      challenge={challenge}
      requiredModule={getModule(challenge.requires)}
    />
  );
}
