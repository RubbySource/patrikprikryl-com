export default function StructuredData({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((entry, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  );
}
