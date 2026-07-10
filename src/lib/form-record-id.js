export function extractFormRecordId(data) {
  return data?.id ?? data?.provider?.id ?? data?.partner?.id ?? data?.lead?.id ?? "";
}

export function bindField(updateField, key) {
  const handler = (event) => updateField(key, event.target.value);
  return {
    onChange: handler,
    onInput: handler,
  };
}
