type ServiceProfileMetaProps = {
  dateOfBirth?: string | null;
  timeOfBirth?: string | null;
  placeOfBirth?: string | null;
  dobPrefix: string;
};

export function ServiceProfileMeta({
  dateOfBirth,
  timeOfBirth,
  placeOfBirth,
  dobPrefix,
}: ServiceProfileMetaProps) {
  if (!dateOfBirth && !timeOfBirth && !placeOfBirth) return null;

  return (
    <div className="space-y-0.5 text-sm text-gray-500">
      {dateOfBirth ? (
        <p>
          {dobPrefix} {dateOfBirth}
          {timeOfBirth ? ` · ${timeOfBirth}` : ''}
        </p>
      ) : timeOfBirth ? (
        <p>{timeOfBirth}</p>
      ) : null}
      {placeOfBirth ? <p className="wrap-break-word leading-snug">{placeOfBirth}</p> : null}
    </div>
  );
}
