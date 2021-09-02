export default function StringToNumericTransformer({ value }) {
  if (
    typeof value === 'number' ||
    (typeof value === 'string' && value.trim().length > 0)
  )
    return Number(value) || NaN;
  return null;
}
