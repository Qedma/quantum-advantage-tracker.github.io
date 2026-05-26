import submissionsCVP from '../../../data/classically-verifiable-problems/submissions.json' with { type: 'json' };
import submissionsOE from '../../../data/observable-estimations/submissions.json' with { type: 'json' };
import submissionsVP from '../../../data/variational-problems/submissions.json' with { type: 'json' };

const submissions = [...submissionsCVP, ...submissionsOE, ...submissionsVP];

const institutionsSet = new Set<string>();

submissions.forEach((submission) => {
  if (submission.institutions) {
    submission.institutions.split(',').forEach((institution) => {
      institutionsSet.add(institution.trim());
    });
  }
});

const institutions = Array.from(institutionsSet).sort((a, b) =>
  a.toLowerCase().localeCompare(b.toLowerCase()),
);

export function Contributors() {
  return (
    <div
      className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] pt-6"
      aria-label="Contributing institutions"
    >
      <ul className="motion-safe:animate-marquee flex w-max min-w-full shrink-0 items-center justify-around gap-16 pr-16">
        {institutions.map((institution) => (
          <li
            key={institution}
            className="flex items-center gap-16 text-xl font-light whitespace-nowrap"
          >
            {institution}
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-600" />
          </li>
        ))}
        {/* Duplicate the list to ensure a seamless infinite marquee animation */}
        {institutions.map((institution) => (
          <li
            key={`duplicate-${institution}`}
            aria-hidden="true"
            className="flex items-center gap-16 text-xl font-light whitespace-nowrap"
          >
            {institution}
            <span className="h-2 w-2 rounded-full bg-green-600" />
          </li>
        ))}
      </ul>
    </div>
  );
}
